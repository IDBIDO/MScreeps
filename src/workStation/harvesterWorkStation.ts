import {WorkStation} from "@/workStation/workStation";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import ColonyMem from "@/access_mem/colonyMem";

export class HarvesterWorkStation extends WorkStation   {
    workPosition: [number, number, number][];  // workPosition[0] = x, workPosition[1] = y, workPosition[2]: 0|1 = ocupied?
    distanceToSpawn: number;


    constructor( roomName: string , id?: StationType ) {
        super(roomName ,id);
        this.departmentName = 'dpt_harvest';
        this.sourceInfo = {
            sourceId: null,
            roomName: roomName,
            pos: null,
        }
    }

    // load work station from memory
    public getMemObject(): HarvesterWorkStationData {

        const colonyMem = new ColonyMem(this.roomName);
        return colonyMem.getWorkStationMem(this.departmentName, this.id as StationType);

        //let mem = new DptHarvesterMem(this.roomName);
        //return mem.getWorkStation(this.id);
    }

    protected getCreepTask(): CreepTask {
        const mem = this.getMemObject();
        const source: modelDataRoom = {
            id: mem.sourceInfo.sourceId,
            roomName: mem.sourceInfo.roomName,
            pos: mem.sourceInfo.pos,
        }
        const target: modelDataRoom = {
            id: mem.targetInfo.targetId,
            roomName: mem.targetInfo.roomName,
            pos: mem.targetInfo.pos,
        }
        //workPosition[0] = x, workPosition[1] = y, workPosition[2]: 0|1 = ocupied?--------------------------
        return {
            sourceInfo: source,
            targetInfo: target,
            workPosition: null,
        }

    }

    protected getStationData(): HarvesterWorkStationData {

        return {
            //type: this.type,
            order: this.order,

            workPosition: this.workPosition,
            creepList: this.creepList,

            sourceInfo: this.sourceInfo,
            targetInfo: this.targetInfo,

            creepConfig: this.creepConfig,

            distanceToSpawn: this.distanceToSpawn,
            needTransporterCreep: this.needTransporterCreep,
            transporterSetting: this.transporterSetting
        };

    }
    /***************** ORDER ***********************/

    protected otherOperation() {

    }

    /************* INITIALIZE ***************/

    public getRoomSourceData(stationType: HarvesterStationType): modelData {
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

    // create new work station and save to memory
    public initializeHarvesterWorkStationAndSave(stationType: HarvesterStationType, sourceId?: string, pos?: [number, number]){
        this.initializeHarvesterWorkStation(stationType, sourceId, pos);
        this.saveToMemory(stationType);
    }

    // create new work station
    //sourceId only for highway, also need parameter pos
    private initializeHarvesterWorkStation(stationType: HarvesterStationType, sourceId?: string, pos?: [number, number]) {

        //this.type = stationType;
        this.id = stationType;
        this.order = [];
        this.creepList = [];

        this.targetInfo = {
            targetId: null,
            roomName: this.roomName,
            pos: null,
        };

        let bodyType: 'default' | 'big' = 'default';
        let priority = 0;
        if (stationType.includes('highway')) {
            bodyType = 'big';
            priority = 1;
        }
        this.creepConfig = {
            body: bodyType,        //default body option
            priority: priority,    //highest priority
            memory: {
                working: false,
                ready:  false,
                role: 'initializer',
                workStationID: this.id,
                departmentName:  'dpt_harvest',
                roomName:  this.roomName,
                dontPullMe: false,
            }
        };

        //this.distanceToSpawn = this.getDistanceToNearSpawn(pos, roomName);

        this.needTransporterCreep = true;       //need transporter creep to transport energy to spawn
        this.transporterSetting = {
            stationId : this.id,
            needWithdraw: true,
            amount: -1,
            resourceType: RESOURCE_ENERGY,
        };


        if(sourceId){
            this.sourceInfo.sourceId = sourceId;
            this.sourceInfo.pos =  pos;
        } else {
            let sourceData = this.getRoomSourceData(stationType);
            this.sourceInfo.sourceId = sourceData.id;
            this.sourceInfo.pos = sourceData.pos;
        }

        let roomName = this.roomName;
        let sourcePos = this.sourceInfo.pos;

        this.workPosition = [];
        if(sourcePos && roomName){
            let auxRoomPos = new RoomPosition(sourcePos[0], sourcePos[1], roomName);
            let adjPosList:RoomPosition[] = auxRoomPos['getAdjacentPositions']();
            for (let i in adjPosList){
                let auxPos = adjPosList[i];
                if (auxPos['isWalkable']())
                    this.workPosition.push([auxPos.x, auxPos.y, 0]);
            }
        }
    }


    public saveToMemory(stationType: HarvesterStationType) {
        //let dptHarvestMem = new DptHarvesterMem(this.roomName);
        //const r = dptHarvestMem.addWorkStation(this.id, this.getStationData());

        const colonyMem = new ColonyMem(this.roomName);
        const r = colonyMem.addWorkStation(this.departmentName, this.id as StationType, this.getStationData());

        if (r) console.log('Harvester WS '+ this.id +' save to memory');
        else console.log('ERROR: Harvester WS '+ this.id +' save to memory FAILED! STATION ALREADY EXISTS');
    }







}