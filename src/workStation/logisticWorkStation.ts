import {WorkStation} from "@/workStation/workStation";
import ColonyMem from "@/access_mem/colonyMem";
import _ from 'lodash';
export class LogisticWorkStation extends WorkStation {

    order:  LogisticWorkStationOrder [];
    fillTask:number;
    taskList:{
        MOVE: {
            [id: string]: TransporterTaskData
        },
        TRANSFER: {
            [id: string]: TransporterTaskData
        },
        WITHDRAW: {
            [id: string]: TransporterTaskData
        },
    }
    availableCreepList: string[];
    toRemoveCreepList: CreepDeadTick

    constructor( roomName: string , id: StationType ) {
        //define memLocation
        super(roomName ,id);
        this.departmentName = 'dpt_logistic';

    }


    /****************** INITIALIZATION ******************/

    protected getMemObject(): LogisticStationMemory {
        const colonyMem = new ColonyMem(this.roomName);

        return colonyMem.getWorkStationMem(this.departmentName, this.id as StationType);
    }

    private getCurrentData(): LogisticStationMemory {
        return {
            order: this.order,
            creepDeadTick: this.creepDeadTick,
            creepConfig: this.creepConfig,
            fillTask: this.fillTask,
            taskList: this.taskList,
            availableCreepList: this.availableCreepList,
            toRemoveCreepList: this.toRemoveCreepList,
        }
    }

    private initialize() {

        this.order = [];
        this.creepDeadTick = {};
        let bodyType: 'default' | 'big' = 'default';
        let priority: number = 0;
        if (this.id.includes('external')) {
            bodyType = 'big';
            priority = 2;
        }

        this.creepConfig = {

            body: bodyType,        //default body option
            priority: priority,    //highest priority
            creepMemory: {
                role: 'transporter',
                taskData: null,

                working: false,
                ready:  false,
                dontPullMe: false,

                workStationID: this.id,
                departmentName:  this.departmentName,
                roomName:  this.roomName,
            }

        };
        this.fillTask = 0;
        this.taskList = {
            MOVE: {},
            TRANSFER: {},
            WITHDRAW: {},
        }
        this.availableCreepList = [];
        this.toRemoveCreepList = {};

    }

    private saveToMemory(stationType: LogisticStationType) {
        const colonyMem = new ColonyMem(this.roomName);
        const r = colonyMem.addWorkStation(this.departmentName, this.id as StationType, this.getCurrentData());
        if (r) console.log('Logistic WS '+ this.id +' save to memory');
        else console.log('ERROR: Harvester WS '+ this.id +' save to memory FAILED! STATION ALREADY EXISTS');
    }

    public initializeAndSave() {
        this.initialize();
        this.saveToMemory(this.id as LogisticStationType);
    }

    /********************* ORDER  *************************/

    private addCreep() {
        const mem = this.getMemObject();
        const creepName = this.getRandomName();
        mem.creepDeadTick[creepName] = 0;
        console.log('[' + this.departmentName + ', '+ this.roomName + '] Work station '+ this.id +
            ' add creep, now creep list size is ' + mem['creepDeadTick'].length);
    }
    private deleteCreep() {
        const mem = this.getMemObject();
        const aux = Object.keys(mem.creepDeadTick);
        const creepName = aux[aux.length - 1];
        if(creepName) {
            mem.toRemoveCreepList[creepName] = mem.creepDeadTick[creepName];
            delete mem.creepDeadTick[creepName];
            console.log('[' + this.departmentName + ', '+ this.roomName + '] Work station '+ this.id +
                ' delete creep, now creep list size is ' + mem['creepDeadTick'].length);
        }
        else {
            console.log('ERROR: deleteCreep() in logisticWorkStation.ts, creepName is null');
        }

    }
    protected executeOrder(): void {
        const mem = this.getMemObject();
        const orderList = mem.order;
        const taskList = mem.taskList;
        for (let i = 0; i < orderList.length; ++i) {
            const order = orderList[i];
            switch (order.name) {
                case "ADD_CREEP":
                    this.addCreep();
                    break;
                case "DELETE_CREEP":
                    this.deleteCreep();
                    break;
                case "ADD_TASK":
                    const taskType = order.data['taskType'];
                    if (taskType == 'FILL') {
                        mem.fillTask += 1;
                    }
                    else {

                        mem.taskList[taskType][order.data['stationId']] = order.data;
                    }
                    break

                case "DELETE_TASK":
                    const taskType2 = order.data['taskType'];
                    if (taskType2 == 'FILL') {
                        mem.fillTask -= 1;
                    }
                    else {
                        const taskID = order.data['stationId']
                        delete mem.taskList[taskType2][taskID];
                    }
                    break

                default:
                    break;
            }
            mem['order'].shift();
        }

    }


    /****************** ASSIGN TASK TO AVAILABLE CREEPS ******************/

    public addToAvailableCreepList(creepName: string) {

        const mem = this.getMemObject();
        // search creepName in mem.availableCreepList
        let found = false;
        for (let i = 0; i < mem.availableCreepList.length; ++i) {
            if (mem.availableCreepList[i] == creepName) {
                found = true;
                break;
            }
        }
        if(!found) {
            mem.availableCreepList.push(creepName);
        }

    }




    private getAvailableTask(taskList: {[p: string]: TransporterTaskData}): string {
        for (let taskID in taskList) {
            const task = taskList[taskID];
            if (task.transporterCreepName == null) return taskID;
        }
        return null;
    }

    private assignFILLTask() {
        const mem = this.getMemObject();
        const creepList = mem.availableCreepList;

        // 1. assign FILL task
        const fillTask = mem.fillTask;
        if (fillTask > 0) {
            for (let i = 0; i < creepList.length; ++i) {
                const creep = Game.creeps[creepList[i]];
                const transporterTaskLocation: TransporterTaskLocation = {
                    'taskType': 'FILL',
                    'stationId': null,
                }
                creep.memory['taskData'] = transporterTaskLocation;
                //remove creepName from creepList
                creepList.splice(i, 1);
                mem.fillTask--;
            }
        }
    }

    private checkWITHDRAWTaskInProcess(): number {
        const mem = this.getMemObject();
        const withdrawTask = mem.taskList.WITHDRAW;
        let count = 0;
        for (const i in withdrawTask) {
            if (withdrawTask[i].transporterCreepName) ++count;
        }
        return count;
    }
    private assignWITHDRAWTask() {
        if (Game.time % 3 != 0) return;

        //if (this.checkWITHDRAWTaskInProcess() > 0) return;
        const mem = this.getMemObject();
        const creepList = mem.availableCreepList;
        //2. assign WITHDRAW task
        const withdrawTask = mem.taskList.WITHDRAW;
        //const withDrawTakIDList = Object.keys(withdrawTask)

        let taskID = this.getAvailableTask(withdrawTask);
        // hay creeps disponibles y tareas disponibles
        while (creepList.length > 0 && taskID != null) {
            const structure = Game.getObjectById(withdrawTask[taskID].taskObjectInfo.id as Id<StructureContainer>);
            //console.log(21111)
            //const resourceType = withdrawTask[taskID].resourceType;/

            //@ts-ignore
            const totalCapacity = _.sum(structure.store)/5;
            if (structure.store.getUsedCapacity() > totalCapacity) {
                const creep = Game.creeps[creepList[0]];
                const transporterTaskLocation: TransporterTaskLocation = {
                    'taskType': 'WITHDRAW',
                    'stationId': taskID,
                }
                creep.memory['taskData'] = transporterTaskLocation;

                creepList.splice(0, 1);
                withdrawTask[taskID].transporterCreepName = creep.name;
                taskID = this.getAvailableTask(withdrawTask);
            }


        }
    }

    private assignTRANSFERTask() {
        const mem = this.getMemObject();
        const creepList = mem.availableCreepList;


        //3. assign TRANSFER task
        const transferTask = mem.taskList.TRANSFER;
        //const transferTakIDList = Object.keys(transferTask)
        let taskID = this.getAvailableTask(transferTask);
        while (creepList.length > 0 && taskID != null) {
            const creep = Game.creeps[creepList[0]];
            const transporterTaskLocation: TransporterTaskLocation = {
                'taskType': 'TRANSFER',
                'stationId': taskID,
            }
            creep.memory['taskData'] = transporterTaskLocation;

            creepList.splice(0, 1);
            transferTask[taskID].transporterCreepName = creep.name;
            taskID = this.getAvailableTask(transferTask);
        }
    }

    private assignMOVETask() {
        const mem = this.getMemObject();
        const creepList = mem.availableCreepList;
        //4. assign MOVE task
        const moveTask = mem.taskList.MOVE;
        //const moveTakIDList = Object.keys(moveTask)
        let taskID = this.getAvailableTask(moveTask);
        while (creepList.length > 0 && taskID != null) {
            const creep = Game.creeps[creepList[0]];
            const transporterTaskLocation: TransporterTaskLocation = {
                'taskType': 'MOVE',
                'stationId': taskID,
            }
            creep.memory['taskData'] = transporterTaskLocation;

            creepList.splice(0, 1);
            moveTask[taskID].transporterCreepName = creep.name;
            taskID = this.getAvailableTask(moveTask);
        }
    }


    private assignTaskToAvailableCreep() {
        this.assignFILLTask();
        this.assignWITHDRAWTask();
        this.assignTRANSFERTask();

        this.assignMOVETask();

    }

    public getTaskData(taskType: string, taskID: string): TransporterTaskData {
        const mem = this.getMemObject();

        if (mem.taskList[taskType][taskID]) return mem.taskList[taskType][taskID];
        return null;        // task no exist, task deleted
    }

    /****************** CREEPS NUM CONTROL ******************/
    private removeDeleteCreep() {
        const mem = this.getMemObject();
        for (let creepName in mem.toRemoveCreepList) {
            if(mem.toRemoveCreepList[creepName] < Game.time) {
                delete mem.toRemoveCreepList[creepName];
            }
        }
    }

    /*************************** CONSULTOR ***************************************/

    public exitsTask(taskType: LogisticTaskType, stationId: string): boolean {
        const mem = this.getMemObject();
        const taskList: {[p: string]: TransporterTaskData} = mem.taskList[taskType]
        for (const id in taskList) {
            if(id === stationId) return true;
        }
        return false;
    }



    /************************* MAINTENANCE *********************************/

    private deleteMOVETask() {
        const mem = this.getMemObject();
        const moveTaskList = mem.taskList.MOVE;
        for (const task in moveTaskList) {
            const data = moveTaskList[task];
            const stationDpt = data.stationDpt;
            const stationId = data.stationId;
            if (!Memory['colony'][this.roomName][stationDpt][stationId]['needTransporterCreep']) {
                delete moveTaskList[task]
            }

        }
    }

    private deleteWITHDRAWTask() {
        const mem = this.getMemObject();
        const withDrawList = mem.taskList.MOVE;
        for (const task in withDrawList) {
            const data = withDrawList[task];
            // TO COMPLETE
        }
    }

    private deleteTRANSFERTask() {

    }

    private deleteCompleteTask() {
        this.deleteMOVETask();
        this.deleteWITHDRAWTask();
        this.deleteTRANSFERTask();
    }

    protected maintenance(): void {
        // remove delete creep list
        this.deleteCompleteTask();

        this.removeDeleteCreep();

        this.assignTaskToAvailableCreep();

        this.renewCreeps();



        //if (Game.time % 3 === 0) this.creepNumControl();

    }




}