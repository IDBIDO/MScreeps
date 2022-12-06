import {WorkStation} from "@/workStation/workStation";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import ColonyMem from "@/access_mem/colonyMem";


export class LogisticWorkStation extends WorkStation   {

    availableCreep: string[];
    taskList: {
        temporalTask: {},
        permanentTask: {},
    }


    constructor( roomName: string , id?: StationType ) {
        super(roomName ,id);
        this.departmentName = 'dpt_logistic';
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
        this.taskList.temporalTask = [];
        this.taskList.permanentTask = [];
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
    }

    // random id for the task
    public generateTaskId(): string {
        const id = Math.random().toString(36).substr(2, 9);
        return id;
    }
    public addTemporalTask(task: logisticTask) {
        //this.taskList.temporalTask.push(task);
        this.taskList.temporalTask[this.generateTaskId()] = task;
    }

    public addPermanentTask(task: logisticTask) {
        //this.taskList.permanentTask.push(task);
        this.taskList.permanentTask[this.generateTaskId()] = task;
    }

    public removeTemporalTask(taskID: string) {
        /*
        const index = this.taskList.temporalTask.indexOf(task);
        if (index > -1) {
            this.taskList.temporalTask.splice(index, 1);
        }
         */
        delete this.taskList.temporalTask[taskID];
    }

    public removePermanentTask(task: logisticTask) {
        /*
        const index = this.taskList.permanentTask.indexOf(task);
        if (index > -1) {
            this.taskList.permanentTask.splice(index, 1);
        }
         */
        delete this.taskList.permanentTask[task.taskID];
    }

    public addAvailableCreep(creepName: string) {
        if (!this.availableCreep.includes(creepName)) {
            this.availableCreep.push(creepName);
        }

    }

    public removeAvailableCreep(creepName: string) {
        const index = this.availableCreep.indexOf(creepName);
        if (index > -1) {
            this.availableCreep.splice(index, 1);
        }
    }
}