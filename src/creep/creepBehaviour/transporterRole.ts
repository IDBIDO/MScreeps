import {LogisticWorkStation} from "@/workStation/logisticWorkStation";
import {SendOrder} from "@/workStation/sendOrder";
import {ColonyStatus} from "@/colony/colonyStatus";


export function sendTaskRequest(creep: Creep) {
    const myDPT = new LogisticWorkStation(creep.memory.roomName, creep.memory.workStationID as StationType);
    myDPT.addToAvailableCreepList(creep.name);
}

export function getFullStorageCreepForMOVE(stationDpt: string, stationId: string, roomName: string): string | null {
    const mem = Memory['colony'][roomName][stationDpt][stationId]['creepDeadTick']
    let maxCreepName = null;
    let maxCreepValue = -1;
    for (let creepName in mem) {
        const creep = Game.creeps[creepName];
        if (creep && creep.store.getUsedCapacity() > maxCreepValue) {
            maxCreepName = creepName;
            maxCreepValue = creep.store.getUsedCapacity();
        }

    }
    return maxCreepName;
}

export function moveTaskFinished(stationDpt: string, stationId: string, roomName: string): boolean {
    return !Memory['colony'][roomName][stationDpt][stationId]['needTransporterCreep']
}

export function getTaskData(creep: Creep): TransporterTaskData {

    const logisticDpt = new LogisticWorkStation(creep.memory.roomName, creep.memory.workStationID as StationType);
    const taskData = logisticDpt.getTaskData(creep.memory.taskData['taskType'], creep.memory.taskData['stationId']);
    return taskData;
}

export function deleteTask(creep: Creep) {
    const sendOrder = new SendOrder(creep.memory.roomName);
    const orderData: TransporterTaskLocation = {
        taskType: creep.memory.taskData['taskType'],
        stationId: creep.memory.taskData['stationId']
    }
    sendOrder.logistic_sendOrder(creep.memory.workStationID as StationType, 'DELETE_TASK', orderData);

}

export function deadOperation(creep: Creep) {
    let taskLocation = creep.memory['taskData'] as TransporterTaskLocation;
    const logisticDPT = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID'] as StationType);
    const taskData = logisticDPT.getTaskData(taskLocation.taskType, taskLocation.stationId);

    taskData.transporterCreepName = null;
    creep.suicide();
}

const transporterRole:{
    [role in TransporterRole]: (data: {}) => ICreepConfig
} = {

    transporter: (data:  TransporterTaskLocation): ICreepConfig => ({

        source: (creep: Creep): boolean => {
            // check check live time
            if (creep.ticksToLive < 3) deadOperation(creep);

            if (data != null) {
                return transferTaskOperations[data.taskType].source(creep);
            }
            else {
                sendTaskRequest(creep);
                console.log('send or wait task');
                return false;
            }


        },

        target: (creep: Creep): boolean => {

            if (creep.ticksToLive < 3) deadOperation(creep);

            if (data != null) {
                return transferTaskOperations[data.taskType].target(creep);
            }
            console.log('waiting for task');

            return false;
        }
    })

}


export const transferTaskOperations: { [task in 'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL']: transferTaskOperation
} = {
    FILL: {
        source: (creep:Creep) => {
            /*
            const creepTask: CreepTask = creep.memory['creepTask'];
            // @ts-ignore
            const source = Game.getObjectById(creepTask.sourceInfo.id);
            //@ts-ignore
            if (creep.withdraw(source, 'energy') == ERR_NOT_IN_RANGE) { //@ts-ignore
                creep.moveTo(source);
            }

             */

            return creep.store.getFreeCapacity() <= 0;
        },
        target: (creep:Creep) => {
            /*
            const creepTask: CreepTask = creep.memory['creepTask'];
            const targetID =  creepTask.targetInfo.id;
            let target: StructureExtension
            if (targetID) {
                // @ts-ignore
                target = <StructureExtension>Game.getObjectById(targetID)
                if (!target || target.structureType !== STRUCTURE_EXTENSION || target.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                    //creep.memory['task']['target'] = null;
                    creepTask.targetInfo.id = null;
                    //creep.memory['sendTaskRequest'] = false;
                    target = undefined
                }
            }
            // 没缓存就重新获取
            if (!target) {
                // 获取有需求的建筑
                target = <StructureExtension>creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    // extension 中的能量没填满
                    filter: s => ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0))
                })

                if (!target) {
                    // 都填满了，任务完成

                    const logisticStation = new LogisticWorkStation_old(creep.memory['roomName'], creep.memory['workStationID']);
                    logisticStation.removeTask(creepTask.taskID);
                    creepTask.taskID = null;

                    return true
                }

                // 写入缓存
                //creep.memory['task']['target'] = target.id
                creepTask.targetInfo.id = target.id

            }

            creep.moveTo(target.pos)
            const result = creep.transfer(target, RESOURCE_ENERGY)
            if (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_FULL) return true
            else if (result != OK && result != ERR_NOT_IN_RANGE) creep.say(`拓展填充 ${result}`)

            if (creep.store[RESOURCE_ENERGY] === 0) return true


             */

            return false;
        }

    },
    MOVE: {
        source: (creep:Creep) => {
            let taskLocation = creep.memory['taskData'] as TransporterTaskLocation;
            const logisticDPT = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID'] as StationType);
            const taskData = logisticDPT.getTaskData(taskLocation.taskType, taskLocation.stationId);


            if (!taskData) {
                //taskData = null;    // 任务完成
                creep.memory['taskData'] = null;
                //deleteTask(creep);
                return false;
            }

            else {
                const creepName = getFullStorageCreepForMOVE(taskData.stationDpt, taskData.stationId, creep.memory['roomName']);
                if (creepName) {
                    const objectCreep = Game.creeps[creepName];
                    if (!creep.pos.isNearTo(objectCreep)) {
                        creep.moveTo(objectCreep.pos);
                        //return false;
                    }
                }
            }

            //creep.say('💤');
            return creep.store.getFreeCapacity() == 0;
        },
        target: (creep:Creep) => {
            creep.say('💤');
            const colonyStatus = new ColonyStatus(creep.memory['roomName']);
            const storageID = colonyStatus.getStorageID();
            const storage = Game.getObjectById(storageID as Id<StructureStorage> );

            const resourceType = Object.keys(creep.store)[0] as ResourceConstant;
            if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
            return creep.store.getUsedCapacity() == 0;
        }

    },
    TRANSFER: {
        source: (creep:Creep) => {
            let taskLocation = creep.memory['taskData'] as TransporterTaskLocation;
            const logisticDPT = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID'] as StationType);
            const taskData = logisticDPT.getTaskData(taskLocation.taskType, taskLocation.stationId);

            const colonyStatus = new ColonyStatus(creep.memory['roomName']);
            const storageID = colonyStatus.getStorageID();
            // PRE:  storage exist
            const storage = Game.getObjectById(storageID as Id<StructureStorage> );

            const r = creep.withdraw(storage, taskData.resourceType, taskData.amount);
            if (r == ERR_NOT_IN_RANGE) creep.moveTo(storage);

            return creep.store.getFreeCapacity() == 0;
        },
        target: (creep:Creep) => {

            let taskLocation = creep.memory['taskData'] as TransporterTaskLocation;
            const logisticDPT = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID'] as StationType);
            const taskData = logisticDPT.getTaskData(taskLocation.taskType, taskLocation.stationId);

            const targetStructure = Game.getObjectById(taskData.taskObjectInfo.id as Id<StructureStorage>);

            const r = creep.transfer(targetStructure, taskData.resourceType);
            if (r == ERR_NOT_IN_RANGE) creep.moveTo(targetStructure);

            return creep.store.getUsedCapacity() == 0;
        }

    },
    WITHDRAW: {

        source: (creep: Creep) => {
            let taskLocation = creep.memory['taskData'] as TransporterTaskLocation;
            const logisticDPT = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID'] as StationType);
            const taskData = logisticDPT.getTaskData(taskLocation.taskType, taskLocation.stationId);

            // move to target room
            if (creep.room.name != taskData.taskObjectInfo.roomName) {
                const pos = new RoomPosition(taskData.taskObjectInfo.pos[0], taskData.taskObjectInfo.pos[1], taskData.taskObjectInfo.roomName)
                creep.moveTo(pos);
                return false;
            }

            // withdraw or move to target
            const structure = Game.getObjectById(taskData.taskObjectInfo.id as Id<StructureStorage>);
            if (structure) {
                const r = creep.withdraw(structure, taskData.resourceType);
                if (r == ERR_NOT_IN_RANGE) creep.moveTo(structure);
            }

            return creep.store.getFreeCapacity() <= 0;
        },
        target: (creep: Creep) => {

            const colonyStatus = new ColonyStatus(creep.memory['roomName']);
            const storageID = colonyStatus.getStorageID();
            // PRE:  storage exist
            const storage = Game.getObjectById(storageID as Id<StructureStorage> );

            const creepResources = Object.keys(creep.store)[0]

            if (creepResources) {
                const r = creep.transfer(storage, creepResources as ResourceConstant);
                if (r == ERR_NOT_IN_RANGE) {creep.moveTo(storage); return false; }
                return true;
            }
            //return false;

        }

    }

}
export default transporterRole;

