import {WorkStation} from "@/workStation/workStation";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import ColonyMem from "@/access_mem/colonyMem";


export class LogisticWorkStation extends WorkStation   {

    availableCreep: string[];
    taskList: {};


    constructor( roomName: string , id?: StationType ) {
        super(roomName ,id);
        this.departmentName = 'dpt_logistic';
        if (id) {
            this.sourceInfo = {         // storage information
                sourceId: null,
                roomName: roomName,
                pos: null,
            }
            this.availableCreep = [];
            this.taskList = {
                temporalTask: [],
                permanentTask: [],
            }
            this.taskList = {};
        }
    }
    
    public getCreepTask(): CreepTask {
        return {
            taskID: null,
            taskType: null,
            sourceInfo: {
                id: null,
                roomName: this.roomName,
                pos: null,
            },
            targetInfo: {
                id: null,
                roomName: null,
                pos: null,
            },
            workPosition: {
                pos: null,
                roomName: null,
            },
        }
    }

    protected getMemObject(): object {
        const colonyMem = new ColonyMem(this.roomName);
        return colonyMem.getWorkStationMem(this.departmentName, this.id as StationType);
    }

    protected getStationData(): LogisticWorkStationData {
        const data: LogisticWorkStationData = {
            order: this.order,
            availableCreep: this.availableCreep,
            creepConfig: this.creepConfig,
            creepList: this.creepList,
            sourceInfo: this.sourceInfo,
            targetInfo: this.targetInfo,
            taskList: this.taskList,

        }
        return data;
    }
    /*********************************** ORDERS ***************************************/

    private assignTaskToCreep(creepName: string, task: logisticTask, taskName: string) {
        const creep = Game.creeps[creepName];
        creep.memory['creepTask']['taskID'] = taskName;
        creep.memory['creepTask']['taskType'] = task.type;
        //creep.memory['creepTask']['sourceInfo'] = task.sourceInfo;
        creep.memory['creepTask']['targetInfo'] = task.targetInfo;

    }

    // get no creep assigned task id
    public getAvailableTaskId(): string {
        const mem = this.getMemObject();
        const taskList = mem['taskList'];
        for (const taskID in taskList['temporalTask']) {
            if (taskList['temporalTask'][taskID].creepName === null) {
                return taskID;
            }
        }
        return null;
    }

    private assignTaskToAvailableCreep() {
        const mem = this.getMemObject();
        const taskList = mem['taskList'];
        const creepList = mem['availableCreep'];
        for (const creepName in creepList) {
            const taskID = this.getAvailableTaskId();
            if (taskID !== null) {
                const task = taskList[taskID];
                this.assignTaskToCreep(creepName, task, taskID);
                task.creepName = creepName;
            }
        }
    }

    private getAvailableTaskNum(): number {
        const mem = this.getMemObject();
        const taskList = mem['taskList'];
        let num = 0;
        for (const taskID in taskList['temporalTask']) {
            if (taskList['temporalTask'][taskID].creepName === null) {
                num++;
            }
        }
        return num;
    }

    private getAvailableCreepNum(): number {
        const mem = this.getMemObject();
        return mem['availableCreep'].length;
    }

    private controlCreepNumber() {
        const availableTaskNum = this.getAvailableTaskNum();
        const availableCreepNum = this.getAvailableCreepNum()
        const diferencia =  availableCreepNum - availableTaskNum;
        if (diferencia < 0) {
            
        }
    }

    // assign a task to a available creep
    protected otherOperation() {
        this.assignTaskToAvailableCreep();

    }

    /*********************************** INITIALIZACION ***************************************/
    public initializeLogisticWorkStationAndSave(stationType: LogisticStationType) {
        this.initializeLogisticWorkStation(stationType);
        this.saveToMemory(stationType);
    }

    private initializeLogisticWorkStation(stationType: LogisticStationType) {
        this.id = stationType;
        this.order = [];
        this.creepList = [];
        this.sourceInfo = {
            sourceId: null,
            roomName: this.roomName,
            pos: null,
        }
        this.targetInfo = {
            targetId: null,
            roomName: null,
            pos: null,
        };
        this.availableCreep = [];
        this.taskList = {}

        let bodyType: 'default' | 'big' = 'default';
        let priority: number = 1;
        if (stationType.includes('externalTransporter')) {
            bodyType = 'big';
            priority = 2;
        }

        this.creepConfig = {
            body: bodyType,        //default body option
            priority: priority,    //highest priority
            memory: {
                working: false,
                ready:  false,
                role: 'transporter',
                workStationID: this.id,
                departmentName:  this.departmentName,
                roomName:  this.roomName,
                dontPullMe: false,
            }
        };
    }

    protected saveToMemory(stationType): void {
        //let dptHarvestMem = new DptHarvesterMem(this.roomName);
        //const r = dptHarvestMem.addWorkStation(this.id, this.getStationData());

        const colonyMem = new ColonyMem(this.roomName);
        const r = colonyMem.addWorkStation(this.departmentName, this.id as StationType, this.getStationData());

        if (r) console.log('Logistic WS '+ this.id +' save to memory');
        else console.log('ERROR: Logistic WS '+ this.id +' save to memory FAILED! STATION ALREADY EXISTS');
    }

    /*********************************** UPDATE ***************************************/
    public setSourceInfo(sourceId: string, pos: [number, number], roomName: string) {
        this.sourceInfo = {
            sourceId: sourceId,
            roomName: roomName,
            pos: pos,
        }
        const mem = this.getMemObject();
        mem['sourceInfo'] = this.sourceInfo;
    }

    // random id for the task
    public generateTaskId(): string {
        const id = Math.random().toString(36).substr(2, 9);
        return id;
    }

    public addTask(task: logisticTask, workStationID: string) {
        const mem = this.getMemObject();
        const taskList = mem['taskList'];
        taskList[workStationID] = task;

    }

    public removeTask(taskId: string) {
        const mem = this.getMemObject();
        const taskList = mem['taskList'];
        delete taskList[taskId];
    }

    public addAvailableCreep(creepName: string) {
        const mem = this.getMemObject();
        if (!mem['availableCreep'].includes(creepName)) {
            mem['availableCreep'].push(creepName);
        }

    }

    public removeAvailableCreep(creepName: string) {
        //const index = this.availableCreep.indexOf(creepName);
        //if (index > -1) {
        //    this.availableCreep.splice(index, 1);
        //}

        const mem = this.getMemObject();
        const index2 = mem['availableCreep'].indexOf(creepName);
        if (index2 > -1) {
            mem['availableCreep'].splice(index2, 1);
        }
    }
}