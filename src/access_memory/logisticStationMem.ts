
/*
interface LogisticStationMemory extends StationMemory {
    order: {name: CreepControlOrder, data: {}}[];
    storageId: string;

    fillTask: string;
    task: {
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
}
*/


export class LogisticStationMem {
    roomName: string;

    rootMem: {};
    stationType: LogisticStationType;

    constructor(roomName: string, stationType: LogisticStationType) {
        this.roomName = roomName;
        this.rootMem = Memory['colony'][roomName]['dpt_logistic'][stationType];
    }

    /***************** CONSULTER *****************/

    getCreepConfig(): CreepSpawnConfig {
        return this.rootMem['creepConfig'];
    }

    getCreepDeadTick(): {
        [creepName: string]: number
    } {
        return this.rootMem['creepDeadTick'];
    }

    getOrder(): {
        name: CreepControlOrder,
        data: {}
    }[] {
        return this.rootMem['order'];
    }
    removeOrder(): void {
        this.rootMem['order'].shift();
    }

    getStorageId(): string {
        return this.rootMem['storageId'];
    }

    updateStorageId(storageId: string): void {
        this.rootMem['storageId'] = storageId;
    }

    getFillTaskCreepName(): string {
        return this.rootMem['fillTask'];
    }

    updateFillTaskCreepName(creepName: string): void {
        this.rootMem['fillTask'] = creepName;
    }

    getTask(): {
        MOVE: {
            [id: string]: TransporterTaskData
        },
        TRANSFER: {
            [id: string]: TransporterTaskData
        },
        WITHDRAW: {
            [id: string]: TransporterTaskData
        },
    } {
        return this.rootMem['task'];
    }

    getTaskWithId(taskType: "MOVE" | "TRANSFER" | "WITHDRAW" | "FILL", taskId: string): TransporterTaskData {
        return this.rootMem['task'][taskType][taskId];
    }

    removeTask(taskType: "MOVE" | "TRANSFER" | "WITHDRAW" | "FILL", id: string): void {

        //const creepName = this.rootMem['task'][taskType][id]["creepName"]

        // if (creepName && Memory.creeps[creepName]) {
        //     this.updateCreepStatus(creepName, "Idle");
        // }
        if (this.rootMem['task'][taskType][id])
            delete this.rootMem['task'][taskType][id];
    }

    getTasksWithNullCreepName(type: "MOVE" | "TRANSFER" | "WITHDRAW" | "FILL"): string[] {
        const tasksOfType: {[id: string]: TransporterTaskData} = this.rootMem['task'][type];

        return Object.entries(tasksOfType)
            .filter(([taskId, task]) => task.creepName === null)
            .map(([taskId]) => taskId);
    }

    getStoragePos(): [number, number] {
        return Memory['colony'][this.roomName]['roomPlanning']['model']['storage'][0]['pos'];
    }

    /***** CREEPS CONTROL MEM *****/

    getCreepTask(creepName: string): {
        id: string;
        type: "MOVE" | "TRANSFER" | "WITHDRAW" | "FILL";
        status: "InProcess" | "TaskDone" | "TaskConfirmed" |"Idle"; }
    {
        return Memory['creeps'][creepName]['task'];
    }

    updateCreepStatus(creepName: string, status: 'InProcess' | 'TaskDone' | 'TaskConfirmed' | 'Idle'): void {
        Memory['creeps'][creepName]['task']['status'] = status;
    }
    updateCreepTask(creepName: string, taskId: string, type:"MOVE" | "TRANSFER" | "WITHDRAW" | "FILL",
                    status: 'InProcess' | 'TaskDone' | 'TaskConfirmed' | 'Idle'): void {
        Memory['creeps'][creepName]['task'] = {
            id: taskId,
            type: type,
            status: status
        };

    }

    removeCreepNameFromTask(taskType: "MOVE" | "TRANSFER" | "WITHDRAW" | "FILL", id: string, creepName: string): void {
        const task = this.rootMem['task'][taskType][id];
        if (task && task['creepName'] === creepName) {
            this.rootMem['task'][taskType][id]['creepName'] = null;
        }

    }

    suicideCreep(creepName: string): void {
        const creep = Game.creeps[creepName];
        if (creep) {
            creep.say("��");
            creep.suicide();
        }
    }

    getIdleCreepName(): string[] {
        const creepDeadTick = this.getCreepDeadTick();
        const creepNameList: string[] = [];
        for (let creepName in creepDeadTick) {
            if (creepDeadTick[creepName] && creepDeadTick[creepName] > 30) {
                const creepTaskStatus = this.getCreepTask(creepName);
                if (creepTaskStatus.status === 'Idle') {
                    creepNameList.push(creepName);
                }
            }
        }
        return creepNameList;
    }


    existTask(taskId: string, taskType: "MOVE" | "WITHDRAW" | "TRANSFER"): boolean {
        const taskList = this.getTask()[taskType];

        for (let currentTaskId in taskList) {
            if (currentTaskId == taskId) {
                return true;
            }
        }

        return false;
    }

}