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


interface TransporterTaskData {
    stationId: string;
    stationDpt: DepartmentName;
    taskType: 'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL'
    amount:  number;
    resourceType:  ResourceConstant;
    taskObjectInfo?: ID_Room_position;
    creepName: string;
    //creepList?: string[];   // only for move task
}

 */

import {Station} from "@/stations/station";
import {LogisticStationMem} from "@/access_memory/logisticStationMem";
import {getEnergyRCL} from "@/creep/creepBodyManager";
import {OrderManager} from "@/orderManager";
import {RoomPlanningMem} from "@/access_memory/roomPlanningMem";

/****
 functions of logistic station(in order of execution)
    1. executeOrder
    2. eliminate complete tasks
    3. eliminate dead creeps & if creep is dead, eliminate its task
    4. assign task to creeps & check if is need to spawn new creep
 *****/

export class LogisticStation extends Station{

    access_memory: LogisticStationMem;

    constructor(roomName: string, stationType: LogisticStationType) {
        super(roomName, stationType);
        this.access_memory = new LogisticStationMem(roomName, stationType);
        this.rootObject = Memory['colony'][roomName]['dpt_logistic'][stationType];
    }

    // TODO IMPLEMENT LOGISTIC STATION EXECUTE ORDER
    executeOrder(): void {

        const orderList = this.access_memory.getOrder();
        const order = orderList[0];
        if (order) {
            switch (order.name) {
                case 'ADD_CREEP':
                    this.addCreep();
                    break;
                case 'REMOVE_CREEP':
                    this.removeCreep(order.data as {creepName: string});
                    break;
                case 'UPDATE_BUILDING_INFO':
                    this.updateBuildingInfo(order.data as {storageId: string});
                    break;
                case 'SEARCH_BUILDING_TASK':
                    this.searchBuildingTask();
                    break;
                case 'UPDATE_CREEP_NUM':
                    this.updateCreepNum();
                    break;
                default:
                    break;

            }
            this.access_memory.removeOrder();

        }

    }

    private updateCreepNum(): void {


    }

    private searchBuildingTask(): void {
        // TODO IMPLEMENT SEARCH BUILDING TASK
        const rcl = Game.rooms[this.roomName].controller?.level;
        const storageId = this.access_memory.getStorageId();


        const storage = Game.getObjectById(storageId as Id<StructureStorage> |
            Id<StructureContainer> | Id<StructureSpawn>);

        const roomPlanningMem = new RoomPlanningMem(this.roomName);
        const storagePos = roomPlanningMem.getModel("storage")[0].pos;

            // if rcl >= 4, and storage is not type of StructureStorage
        const orderManage = new OrderManager(this.roomName);



        if (rcl >= 4 && storage.structureType !== 'storage') {


            // send storage structure to building task
            const buildTaskData: BuildTaskData = {
                id: null,
                department: 'dpt_logistic',
                stationType: 'internal_transport',
                pos: storagePos,
                roomName: this.roomName,
                structureType: 'storage',
                index: 0,
            }
            orderManage.sendOrder('ADD_BUILD_TASK', buildTaskData, 'dpt_build', 'internal_build');
        }

        else {
            const posObject = new RoomPosition(storagePos[0], storagePos[1], this.roomName);
            const container = posObject.lookFor(LOOK_STRUCTURES).find(structure => structure.structureType === 'container');

            if (!container) {

                // send container structure to building task
                const buildTaskData: BuildTaskData = {
                    id: null,
                    department: 'dpt_logistic',
                    stationType: 'internal_transport',
                    pos: storagePos,
                    roomName: this.roomName,
                    structureType: 'container',
                    index: null,
                }
                orderManage.sendOrder('ADD_BUILD_TASK', buildTaskData, 'dpt_build', 'internal_build');

            }

        }

    }

    private updateBuildingInfo(data: {storageId: string}): void {


    }

    private removeCreep(data: {creepName: string}): void {
        // remove creepDeadTick
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        delete creepDeadTick[data.creepName];
    }

    private addCreep(): string {
        // get no repeat creepName
        let creepName: string;
        do {
            creepName = this.getRandomName();
        } while (!this.checkCreepName(creepName));

        //get creepConfig
        const creepConfig = this.access_memory.getCreepConfig();
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        creepDeadTick[creepName] = null;

        // send creepSpawnTask
        this.sendCreepSpawnTask(creepName, creepConfig);
        return creepName;
    }





    maintenance(): void {

        this.eliminateCompleteTask();
        this.eliminateDeadCreep();
        this.eliminateOldCreep();

        this.checkStorageId();

        this.fillCreepControl();

        this.assignFillTask();
        this.assignTask(this.access_memory.getTasksWithNullCreepName("WITHDRAW"), "WITHDRAW");
        this.assignTask(this.access_memory.getTasksWithNullCreepName("MOVE"), "MOVE");
        this.assignTask(this.access_memory.getTasksWithNullCreepName("TRANSFER"), "TRANSFER");

        this.creepNumControl();
        //this.assignTaskToCreep();
        //this.checkNeedSpawn();
        //this.fillCreepControl();
    }

    private checkStorageId(): void {
        const roomPlanningMem = new RoomPlanningMem(this.roomName);
        const storagePos = roomPlanningMem.getModel("storage")[0];
        const storagePosObject = new RoomPosition(storagePos.pos[0], storagePos.pos[1], this.roomName);
        // const find storage in storage Pos
        const storage = storagePosObject.lookFor(LOOK_STRUCTURES).find(structure => structure.structureType === 'storage');

        if (storage) {
            if (this.access_memory.getStorageId() !== storage.id)  this.access_memory.updateStorageId(storage.id);
            else return;
        } // if no storage in storage Pos, find container in this pos
        else {
            const container = storagePosObject.lookFor(LOOK_STRUCTURES).find(structure => structure.structureType === 'container');
            if (container && this.access_memory.getStorageId() != container.id) {
                this.access_memory.updateStorageId(container.id);
            } else {
                // else find any spawn
                const currentStorageId = this.access_memory.getStorageId();
                const spawn = Game.rooms[this.roomName].find(FIND_MY_SPAWNS)[0];
                if (spawn) {
                    this.access_memory.updateStorageId(spawn.id);
                }

            }
        }

    }

    private eliminateCompleteTask(): void {

        const creepDeadTick = this.access_memory.getCreepDeadTick();
        //for each creep in creepDeadTick
        for (let creepName in creepDeadTick) {
            if (creepDeadTick[creepName] && Game.creeps[creepName]) {
                const creepTaskStatus = this.access_memory.getCreepTask(creepName);
                // if task is Done, delete the task
                if (creepTaskStatus.status === 'Done') {
                    //this.access_memory.updateCreepStatus(creepName, 'Idle')
                    if (creepTaskStatus.type !== 'FILL') {
                        this.access_memory.removeTask(creepTaskStatus.type, creepTaskStatus.id);
                        //console.log("eliminateCompleteTask function: " + creepName + " " + creepTaskStatus.type + " " + creepTaskStatus.id)
                    }
                    this.access_memory.updateCreepStatus(creepName, 'Idle')
                }
            }
        }
    }


    private canTakeTask(creepName: string):boolean {
        //TODO TEST THIS FUNCTION  ->>  creep.ticksToLive is undefine when creep is spawning

        const creep = Game.creeps[creepName];
        if (creep) {
            const creepDeadTick = this.access_memory.getCreepDeadTick();

            return creep.ticksToLive >= 50;

        }
        return false

    }


    private eliminateDeadCreep(): void {

        const creepDeadTick = this.access_memory.getCreepDeadTick();
        // for each creep in creepDeadTick
        for (let creepName in creepDeadTick) {
            // if creep is dead, delete the creepDeadTick
            // creep no spawning AND creep no exist
            if (creepDeadTick[creepName] && creepDeadTick[creepName] < Game.time && Game.creeps[creepName] == null) {

                const creepTaskStatus = this.access_memory.getCreepTask(creepName);
                if (creepTaskStatus.status === 'InProcess' || creepTaskStatus.status === 'Done') {
                    if (creepTaskStatus.type !== 'FILL')
                        this.access_memory.removeCreepNameFromTask(creepTaskStatus.type, creepTaskStatus.id, creepName)
                    else {
                        this.access_memory.updateFillTaskCreepName(null);
                    }
                }

                delete creepDeadTick[creepName];
                delete Memory.creeps[creepName];

            }
        }
    }

    private eliminateOldCreep() {
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        for (let creepName in creepDeadTick) {
            if (creepDeadTick[creepName] && creepDeadTick[creepName] + 50 < Game.time) {
                const creepTaskStatus = this.access_memory.getCreepTask(creepName);
                if (creepTaskStatus.status != "InProcess") {
                    if (creepTaskStatus.status === 'Done') {
                        if (creepTaskStatus.type !== 'FILL')
                         this.access_memory.removeCreepNameFromTask(creepTaskStatus.type, creepTaskStatus.id, creepName)
                        else {
                            this.access_memory.updateFillTaskCreepName(null);
                        }
                    }
                    //this.access_memory.suicideCreep(creepName);
                    delete creepDeadTick[creepName];
                    delete Memory.creeps[creepName];

                }
            }
        }

    }

    private assignFillTask(): void {
        const fillTaskCreepName = this.access_memory.getFillTaskCreepName();
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        if (!fillTaskCreepName) return;
        const availableEnergy = Game.rooms[this.roomName].energyAvailable;
        const capacityEnergy = Game.rooms[this.roomName].energyCapacityAvailable

        if (availableEnergy != capacityEnergy && creepDeadTick[fillTaskCreepName]) {
            const creepTaskStatus = this.access_memory.getCreepTask(fillTaskCreepName);
            if (creepTaskStatus.status === 'Idle') {
                this.access_memory.updateCreepTask(fillTaskCreepName, 'FILL', 'FILL', 'InProcess' );
                //TODO
                console.log("assign fill task to creep" + fillTaskCreepName);
            }
        }

    }


    /*
    private assignWithDrawTask(): void {
        const getIdleCreepList = this.access_memory.getIdleCreepName();
        const withDrawTask = this.access_memory.getTask().WITHDRAW;
        const withDrawTaskNames = Object.keys(withDrawTask);
        let taskIndex = 0;
        for (const creepName of getIdleCreepList) {
            const withDrawTaskId = withDrawTaskNames[taskIndex];
            const withDrawTaskInfo = withDrawTask[withDrawTaskId]
            if(withDrawTaskInfo) {
                // assign withdraw task to creep
                this.access_memory.updateCreepTask(creepName, withDrawTaskId, "WITHDRAW", "InProcess");
                // update task Data
                withDrawTaskInfo.creepName = creepName;
            }
        }
    }

     */

    private assignTask(idleTaskId: string[], taskType: "MOVE" | "TRANSFER" | "WITHDRAW" | "FILL"): void{
        const getIdleCreepList = this.access_memory.getIdleCreepName();
        const task:{[id: string]: TransporterTaskData} = this.access_memory.getTask()[taskType];
        const taskNames = idleTaskId;

        let taskIndex = 0;
        let creepIndex = 0;
        while(creepIndex < getIdleCreepList.length && taskIndex < taskNames.length) {
            const creepName = getIdleCreepList[creepIndex];
            //console.log(creepName)
            const taskName = taskNames[taskIndex];
            const taskInfo = task[taskName];
            if(taskInfo) {
                // assign withdraw task to creep
                this.access_memory.updateCreepTask(creepName, taskName, taskType, "InProcess");
                // update task Data
                taskInfo.creepName = creepName;

            }
            creepIndex++;
            taskIndex++;
        }


    }

    private getMaxTicksToLiveIdleCreepName(): string {
        const idleCreepNameList = this.access_memory.getIdleCreepName();
        if (idleCreepNameList.length == 0) return null;
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        let maxTicksToLive = 0;
        let maxTicksToLiveCreepName = idleCreepNameList[0];
        for (let i = 0; i < idleCreepNameList.length; ++i) {
            if (creepDeadTick[idleCreepNameList[i]] > maxTicksToLive) {
                maxTicksToLive = creepDeadTick[idleCreepNameList[i]];
                maxTicksToLiveCreepName = idleCreepNameList[i];
            }
        }
        return maxTicksToLiveCreepName;

    }

    private fillCreepControl() {
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        const idleCreepNameList = this.access_memory.getIdleCreepName();
        // check fill creep
        const fillTaskCreepName = this.access_memory.getFillTaskCreepName();

        // there is no fill creep assigned
        if (!fillTaskCreepName) {
            const maxTicksToLiveCreepName = this.getMaxTicksToLiveIdleCreepName();
            if (maxTicksToLiveCreepName)
                this.access_memory.updateFillTaskCreepName(maxTicksToLiveCreepName);

        }
        // fill creep assigned
        else {
            // fill creep spawning
            if (creepDeadTick[fillTaskCreepName] == null) return

            // fill creep near to dead
            const ticksToLive = creepDeadTick[fillTaskCreepName] - Game.time;
            if (ticksToLive <= 200) {
                const maxTicksToLiveCreepName = this.getMaxTicksToLiveIdleCreepName();
                if (maxTicksToLiveCreepName)
                    this.access_memory.updateFillTaskCreepName(maxTicksToLiveCreepName);
            }

        }


    }

    private creepNumControl() {

        const idleCreepNameList = this.access_memory.getIdleCreepName();
        if (idleCreepNameList.length > 0) return;

        const creepList = this.access_memory.getCreepDeadTick();

        // check if exist in the creep list a creep with a null value
        const isSpawningCreep = Object.values(creepList).some(value => value == null);
        if (isSpawningCreep) return;

        const creepNum = Object.keys(this.access_memory.getCreepDeadTick()).length

        const withdrawTaskNum = Object.keys(this.access_memory.getTask().WITHDRAW).length
        const moveTaskNum = Object.keys(this.access_memory.getTask().MOVE).length

        const transferTaskNum = Object.keys(this.access_memory.getTask().TRANSFER).length

        const controlHeuristic = withdrawTaskNum + moveTaskNum + 1 + Math.floor(transferTaskNum / 3);
        if (creepNum < controlHeuristic) { this.addCreep(); return;     }
        else if (creepNum == controlHeuristic) {
            const fillTaskCreepName = this.access_memory.getFillTaskCreepName();
            const fillCreepDeadTick = this.access_memory.getCreepDeadTick()[fillTaskCreepName];
            if (fillCreepDeadTick && fillCreepDeadTick - Game.time < 200) this.addCreep();
        }
        // TODO MAYBE NEED TO TEST WITH CORRECT VALUES

    }

}