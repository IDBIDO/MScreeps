
import {WorkStation} from "@/workStation/workStation";
import ColonyMem from "@/access_mem/colonyMem";
import {SendOrder} from "@/workStation/sendOrder";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import {LogisticWorkStation} from "@/workStation/logisticWorkStation";

export class HarvesterWorkStation extends WorkStation   {

    /******************* MUTATOR *******************/

    order: HarvesterWorkStationOrder[]
    taskData: {
        sourceInfo: ID_Room_position;
        targetInfo: ID_Room_position
        workPosition: [number, number, number][];  // workPosition[0] = x, workPosition[1] = y, workPosition[2]: 0|1 = ocupied?
    }

    resourceType: ResourceConstant;
    needTransporterCreep:  boolean;
    transporterSetting:  TransporterTaskData;


    constructor( roomName: string , id: StationType ) {
        //define memLocation
        super(roomName ,id);
        this.departmentName = 'dpt_harvest';

    }

    /******************* INITIALIZATION *******************/

    protected getMemObject(): HarvestStationMemory {
        const colonyMem = new ColonyMem(this.roomName);
        return colonyMem.getWorkStationMem(this.departmentName, this.id as StationType);
    }

    private getRoomSourceData(stationType: HarvesterStationType): modelData {
        const colonyMem = new ColonyMem(this.roomName);
        const data = colonyMem.getRoomPlanningMem();
        if (stationType == 'source1') {
            return data.getSource1Data()
        }
        else if (stationType == 'source2') {
            return data.getSource2Data()
        }
        else if (stationType == 'mineral') {
            return data.getMineralData()
        }
    }
    private getCurrentData(): HarvestStationMemory {
        return {

            order: this.order,
            creepDeadTick: this.creepDeadTick,
            creepConfig: this.creepConfig,
            taskData: this.taskData,
            resourceType: this.resourceType,
            needTransporterCreep: this.needTransporterCreep,
            transporterSetting: this.transporterSetting
        }
    }
    private initialize(highwayInfo?: ID_Room_position) {
        const stationType = this.id as HarvesterStationType;
        this.id = stationType;

        // initialize work station common data
        this.order = []
        this.creepDeadTick = {};
        let bodyType: 'default' | 'big' = 'default';

        let priority = 1;
        if (stationType.includes('highway')) {
            bodyType = 'big';
            priority = 2;
        }
        this.creepConfig = {
            body: bodyType,
            creepMemory:{
                role: 'harvester',
                taskData: {
                    sourceInfo: {
                        roomName: null,
                        id: null,
                        pos: null,
                    },
                    targetInfo: {
                        roomName: null,
                        id: null,
                        pos: null,
                    },
                    workPosition: null,

                },      // no task specify
                working:  false,
                ready:  false,
                dontPullMe: false,

                workStationID:  this.id,
                departmentName:  this.departmentName,
                roomName:  this.roomName,
            },
            priority: priority,

        };

        // initialize creep task
        if (highwayInfo) {
            this.taskData = {
                sourceInfo: {
                    id: highwayInfo.id,
                    roomName: highwayInfo.roomName,
                    pos: highwayInfo.pos,
                },
                targetInfo: {
                    id: null,
                    roomName: this.roomName,
                    pos: null,
                },
                workPosition: [],
            }
        }
        else {
            const sourceData = this.getRoomSourceData(stationType);

            let workPosition = [];
            if(sourceData.pos){
                let auxRoomPos = new RoomPosition(sourceData.pos[0], sourceData.pos[1], this.roomName);
                let adjPosList:RoomPosition[] = auxRoomPos['getAdjacentPositions']();
                for (let i in adjPosList){
                    let auxPos = adjPosList[i];
                    if (auxPos['isWalkable']())
                        workPosition.push([auxPos.x, auxPos.y, 0]);
                }
            }
            this.taskData = {
                sourceInfo: {
                    id: sourceData.id,
                    roomName: this.roomName,
                    pos: sourceData.pos,
                },
                targetInfo: {
                    id: null,
                    roomName: this.roomName,
                    pos: null,
                },
                workPosition: workPosition,
            }

        }

        // initialize transporter setting
        this.needTransporterCreep = false;       //need transporter creep to transport energy to spawn

        // initialize resource type
        this.resourceType = 'energy';


        this.transporterSetting = {
            stationDpt: this.departmentName,
            stationId: this.id,
            taskType: 'MOVE',
            amount:  -1,
            resourceType:  RESOURCE_ENERGY,
            transporterCreepName: null,
            //taskObjectInfo?: ID_Room_position;
            //creepList?: string[];   // only for move task
        };

    }
    private saveToMemory(stationType: HarvesterStationType) {
        const colonyMem = new ColonyMem(this.roomName);
        const r = colonyMem.addWorkStation(this.departmentName, this.id as StationType, this.getCurrentData());
        if (r) console.log('Harvester WS '+ this.id +' save to memory');
        else console.log('ERROR: Harvester WS '+ this.id +' save to memory FAILED! STATION ALREADY EXISTS');
    }

    public initializeAndSave(highwayInfo?: ID_Room_position) {
        this.initialize(highwayInfo);
        this.saveToMemory(this.id as HarvesterStationType);
    }


    /******************* ORDERS *******************/
    public getFreeWorkPosition(): [number, number] {
        let workPositionList:[number, number, number][] = this.getMemObject().taskData.workPosition;
        if (!workPositionList) {
            return null;
        }

        //find the first free work position
        for (let workPosition of workPositionList) {
            if (workPosition[2] === 0) {
                console.log('[harvesterWorkStation]: getFreeWorkPosition:' + workPosition[0] + ', ' + workPosition[1] )
                return [workPosition[0], workPosition[1]];
            }
        }
        return null;
    }
    protected setWorkPosition(workPos: [number, number]) {
        console.log(workPos)
        let workPositionList:[number, number, number][] = this.getMemObject().taskData.workPosition;
        for (let workPosition of workPositionList) {
            if (workPosition[0] === workPos[0] && workPosition[1] === workPos[1]) {
                workPosition[2] = 1;

            }
        }
    }
    protected unSetWorkPosition(workPos: [number, number]) {
        let workPositionList:[number, number, number][] = this.getMemObject()['workPosition'];
        if (!workPositionList) {
            return;
        }
        for (let workPosition of workPositionList) {
            if (workPosition[0] == workPos[0] && workPosition[1] == workPos[1]) {
                workPosition[2] = 0;
            }
        }
    }
    private addCreep(): void {

        //generate random creep name
        const creepName = this.getRandomName()

        /*
        let workPosition = this.getFreeWorkPosition();
        if (workPosition) this.setWorkPosition(workPosition);
        else {
            console.log('ERROR: Harvester WS '+ this.id +' addCreep FAILED! NO FREE WORK POSITION');
            return;
        }      //no free work position
        */
        const mem = this.getMemObject();
        const creepNum = Object.keys(mem.creepDeadTick).length;
        const workStationNum = mem.taskData.workPosition.length;
        if (creepNum >= workStationNum) {
            console.log('ERROR: Harvester WS '+ this.id +' addCreep FAILED! CREEP NUM >= WORK POSITION NUM');
            return;
        }

        let stationData = this.getMemObject();
        stationData.creepDeadTick[creepName] = 0;
        //stationData['transporterSetting']['creepList'].push(creepName);     //add creep to transporter creep list

        console.log('[' + this.departmentName + ', '+ this.roomName + '] Work station '+ this.id +
            ' add creep, now creep list size is ' + Object.keys(stationData['creepDeadTick']).length);
    }
    private removeCreep() {
        let stationData = this.getMemObject();
        const creepName = Object.keys(stationData.creepDeadTick)[0];
        if(creepName) {
            delete stationData.creepDeadTick[creepName];
            //remove creep from transporter creep list
            stationData['transporterSetting']['creepList'].splice(stationData['transporterSetting']['creepList'].indexOf(creepName), 1);
            //unSet work position
            const harvesterTask = Memory.creeps[creepName].taskData as HarvesterTaskData;
            const workPos = harvesterTask.workPosition;
            if (workPos) this.unSetWorkPosition(workPos);
            console.log('[' + this.departmentName + ', '+ this.roomName + '] Work station '+ this.id +
                ' remove creep, now creep list size is ' + stationData['creepDeadTick'].length);
        }
        else {
            console.log('ERROR: Harvester WS '+ this.id +' removeCreep FAILED! NO CREEP TO REMOVE');
        }

    }

    private setTransporterCreep() {
        const mem = this.getMemObject();
        mem.needTransporterCreep = true;

        // send logistic task
        const sendOrder = new SendOrder(this.roomName);
        sendOrder.logistic_sendOrder('internal', 'ADD_TASK', mem.transporterSetting);

        //const logisticTaskList = Memory['colony'][this.roomName]['dpt_logistic']['internal']['taskList'];
        //logisticTaskList['MOVE'][this.id] = mem.transporterSetting;
    }

    private unsetTransporterCreep() {
        const mem = this.getMemObject();
        mem.needTransporterCreep = false;

        const sendOrder = new SendOrder(this.roomName);
        sendOrder.logistic_sendOrder('internal' as StationType, 'DELETE_TASK', mem.transporterSetting);

        //const logisticTaskList = Memory['colony'][this.roomName]['dpt_logistic']['taskList'];
        //delete logisticTaskList['MOVE'][this.id];
    }
    private modifyTarget(data: ID_Room_position) {
        const mem  = this.getMemObject();
        mem.taskData.targetInfo = data;
        const object = Game.getObjectById(data.id as Id<Structure>);
        if (object.structureType == 'container') {
            // add withdraw task or update it if exist
            const sendOrder = new SendOrder(this.roomName);
            const taskData: TransporterTaskData = {
                amount: -1,
                resourceType: mem.resourceType,
                stationDpt: mem.transporterSetting.stationDpt,
                stationId: mem.transporterSetting.stationId,
                taskObjectInfo: data,
                taskType: 'WITHDRAW',
                transporterCreepName: null
            }
            sendOrder.logistic_sendOrder('internal', 'ADD_TASK', taskData);
        }
        else {
            // delete previous withdraw task if exist
            const sendOrder = new SendOrder(this.roomName);
            // sendOrder.logistic_sendOrder('internal', 'DELETE_TASK', )
        }

    }

    protected executeOrder(): void {
        const mem = this.getMemObject();
        const order: HarvesterWorkStationOrder = mem['order'][0];

        if (order) {
            switch (order.name) {
                case "ADD_CREEP":
                    this.addCreep();
                    break;
                case "DELETE_CREEP":
                    this.removeCreep();
                    break;
                case "SET_TRANSPORTER_CREEP":
                    this.setTransporterCreep();
                    break;
                case "UNSET_TRANSPORTER_CREEP":
                    this.unsetTransporterCreep();
                    break;
                case "MODIFY_TARGET":
                    const data = order.data;
                    this.modifyTarget(data as ID_Room_position);
                    break;
                default:
                    break;
            }
            mem['order'].shift();

        }
    }




    // interface between work station and creep

    /******************* CREEP COMMUNICATION ***************/
    public giveTaskTo(creep: Creep): void {
        const mem = this.getMemObject()
        const taskData = mem.taskData;
        //mem.creepConfig.creepMemory.taskData['workPosition'] = null;
        creep.memory.taskData['sourceInfo'] = taskData.sourceInfo;
        creep.memory.taskData['targetInfo'] = taskData.targetInfo;
        creep.memory.taskData['workPosition'] = this.getFreeWorkPosition();
        //data.sourceInfo = taskData.sourceInfo;
        //data.targetInfo = taskData.targetInfo;
        //data.workPosition = this.getFreeWorkPosition();
        //console.log(data.workPosition)
        if (creep.memory.taskData['workPosition']) this.setWorkPosition(creep.memory.taskData['workPosition']);
        //mem.creepConfig.creepMemory.taskData['workPosition'] = null;
    }

    public updateTargetInfo(id: string, pos: [number, number]): void {
        const mem = this.getMemObject()
        const taskData = mem.taskData;
        taskData.targetInfo.id = id;
        taskData.targetInfo.pos = pos;
    }

    public getTargetInfo():ID_Room_position {
        const mem = this.getMemObject();
        return mem.taskData.targetInfo;
    }

    public getSourceInfo(): ID_Room_position {
        const mem = this.getMemObject();
        return mem.taskData.sourceInfo;
    }


    /******************* MAINTENANCE *******************/

    private sendWithDrawTask(container: StructureContainer):void {
        const sendOrder = new SendOrder(this.roomName);
        const resource = Object.keys(container.store);
        const mem = this.getMemObject();
        const order: TransporterTaskData = {
            amount: -1,
            resourceType: mem.resourceType,
            stationDpt: 'dpt_harvest',
            stationId: this.id,
            taskObjectInfo: this.getTargetInfo(),
            taskType: 'WITHDRAW',
            transporterCreepName: null

        }
        sendOrder.logistic_sendOrder('internal', 'ADD_TASK', order);
    }

    private checkTarget(): void {
        const mem = this.getMemObject();
        const taskData = mem.taskData;
        const targetInfo = taskData.targetInfo;

        if (targetInfo.id) {
            const containerOrLink = Game.getObjectById(targetInfo.id as Id<StructureContainer> | Id<StructureLink>);
            if (containerOrLink) {
                if (containerOrLink.structureType == 'container' ) {
                    const usedCapacity = containerOrLink.store.getUsedCapacity();
                    const logisticDPT = new LogisticWorkStation(this.roomName, 'internal');
                    if (usedCapacity > usedCapacity/2 && logisticDPT.exitsTask('WITHDRAW', this.id))  this.sendWithDrawTask(containerOrLink);
                }
            }
        }
    }

    protected maintenance(): void {
        this.renewCreeps();

        // do not need to check target, logistic take care
        //this.checkTarget();
    }


}