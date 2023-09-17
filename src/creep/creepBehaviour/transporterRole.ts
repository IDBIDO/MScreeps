
import {LogisticStationMem} from "@/access_memory/logisticStationMem";




// export function getFullStorageCreepForMOVE(stationDpt: string, stationId: string, roomName: string): string | null {
//     const mem = Memory['colony'][roomName][stationDpt][stationId]['creepDeadTick']
//     let maxCreepName = null;
//     let maxCreepValue = -1;
//     for (let creepName in mem) {
//         const creep = Game.creeps[creepName];
//         if (creep && creep.store.getUsedCapacity() > maxCreepValue) {
//             maxCreepName = creepName;
//             maxCreepValue = creep.store.getUsedCapacity();
//         }
//
//     }
//     return maxCreepName;
// }
//
// export function moveTaskFinished(stationDpt: string, stationId: string, roomName: string): boolean {
//     return !Memory['colony'][roomName][stationDpt][stationId]['needTransporterCreep']
// }
//
// export function getTaskData(creep: Creep): TransporterTaskData {
//
//     const logisticDpt = new LogisticWorkStation(creep.memory.roomName, creep.memory.workStationID as StationType);
//     const taskData = logisticDpt.getTaskData(creep.memory.taskData['taskType'], creep.memory.taskData['stationId']);
//     return taskData;
// }
//
// export function deleteTask(creep: Creep) {
//     const sendOrder = new SendOrder(creep.memory.roomName);
//     const orderData: TransporterTaskLocation = {
//         taskType: creep.memory.taskData['taskType'],
//         stationId: creep.memory.taskData['stationId']
//     }
//     sendOrder.logistic_sendOrder(creep.memory.workStationID as StationType, 'DELETE_TASK', orderData);
//
// }
//
// export function deadOperation(creep: Creep) {
//     let taskLocation = creep.memory['taskData'] as TransporterTaskLocation;
//     const logisticDPT = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID'] as StationType);
//     const taskData = logisticDPT.getTaskData(taskLocation.taskType, taskLocation.stationId);
//
//     taskData.transporterCreepName = null;
//     creep.suicide();
// }

//only when creep state is Idle or Done
export function emptyStorageOperation(creep: Creep, needDrop: boolean): boolean {
    const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
    const storageId = logisticStationMem.getStorageId()
    if (storageId) {
        const storage = Game.getObjectById(storageId as Id<StructureStorage> | Id<StructureContainer>);
        if (storage) {
            const creepStorage = Object.keys(creep.store) as ResourceConstant[]
            if (creepStorage[0]) {
                const result = creep.transfer(storage, creepStorage[0]);

                if (result == ERR_NOT_IN_RANGE) { creep.moveTo(storage); return false }
                else return true
                //else if (needDrop && result == ERR_FULL) creep.drop(creepStorage[0]);
            } else return true;
        } else return true;
    } else return true;


}

const transporterRole:{
    [role in TransporterRole]: () => ICreepConfig
} = {

    transporter: (): ICreepConfig => ({

        source: (creep: Creep): boolean => {
            // check live time
            //if (creep.ticksToLive < 30) deadOperation(creep);

            if (creep.memory.task.status == "InProcess") {
                return transferTaskOperations[creep.memory.task.type].source(creep);
            }
            else {
                creep.say('💤');
            }


        },

        target: (creep: Creep): boolean => {
            //if (creep.ticksToLive < 3) deadOperation(creep);
            if (creep.memory.task.status == "InProcess") {
                return transferTaskOperations[creep.memory.task.type].target(creep);
            }
            //console.log('waiting for task');

            return true;
        },

        ending: (creep: Creep): boolean => {
            let r = true;
            if (creep.store.getUsedCapacity() > 0) {
                r = emptyStorageOperation(creep, true);
            }
            //const r =  creep.store.getUsedCapacity() <= 0;
            if (r) {
                creep.memory.ending = false;
                creep.memory.task.status = "Idle";
                creep.memory.working = false;
                return false;
            }
            return true;
        }
    })

}

export function checkUnicResourceType(creep: Creep, resourceType: ResourceConstant) {
    // for each resource type of creep store, check if it is the same as resourceType
    const creepResources = Object.keys(creep.store);
    if (creepResources.length > 1) {
        console.log('ERROR: more than one resource type in creep store');
        return false;
    }
    else if (creepResources.length == 1) {
        if (creepResources[0] != resourceType) {
            console.log('ERROR: wrong resource type in creep store');
            return false;
        }
        else return true;
    }
    // no resource in creep store
    return true;
}

export function initialLevelOperation(creep: Creep) {
    // search for containers with energy and withdraw it
    const containers = creep.room.find(FIND_STRUCTURES, {
        filter: s => (s.structureType == STRUCTURE_CONTAINER)
    }
    )
    if (containers.length > 0) {
    const container = creep.pos.findClosestByRange(containers);
        if (container) {
            const r = creep.withdraw(container, RESOURCE_ENERGY);
            if (r == ERR_NOT_IN_RANGE) creep.moveTo(container);
            else if (r == ERR_NOT_ENOUGH_RESOURCES) return false;
        }

    }
    // if no containers with energy, search for harvest creep and move near them to get energy
    else {
        const harvestCreeps = creep.room.find(FIND_MY_CREEPS, {
            filter: c => (c.memory.role == 'harvester')
        })
        if (harvestCreeps.length > 0) {
            const harvestCreep = creep.pos.findClosestByRange(harvestCreeps);
            if (harvestCreep) {
                if (!creep.pos.isNearTo(harvestCreep)) creep.moveTo(harvestCreep);
                // else {
                //     const r = harvestCreep.transfer(creep, RESOURCE_ENERGY);
                //     if (r == ERR_NOT_ENOUGH_RESOURCES) return false;
                // }
            }
        }
    }

}

export function existTask(taskType: "MOVE" | "TRANSFER" | "WITHDRAW" | "FILL", creep: Creep): boolean {
    const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
    const task = logisticStationMem.getTaskWithId(taskType, creep.memory.task.id);
    if (!task) {

        creep.memory.ending = true;
        creep.memory.task.status = "TaskDone";
        return false;
    }
    // exist task, do no change creep status
    return true;
}

export const transferTaskOperations: { [task in 'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL']: {
    // creep 工作时执行的方法
    target: (creep: Creep) => boolean
    // creep 非工作(收集资源时)执行的方法
    source: (creep: Creep) => boolean
}
} = {
    FILL: {
        source: (creep:Creep) => {
            // if room energy is full, return true
            if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
                creep.memory.task.status = "TaskDone";
                creep.memory.ending = true;
                return false;
            }

            const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
            const storageId = logisticStationMem.getStorageId()
            const storage = Game.getObjectById(storageId as Id<StructureStorage> | Id<StructureContainer> | Id<StructureSpawn>);

            if (checkUnicResourceType(creep, RESOURCE_ENERGY)) {
                if (storageId) {
                    if (storage instanceof StructureSpawn) {

                        initialLevelOperation(creep);
                    } else {

                        const r = creep.withdraw(storage, RESOURCE_ENERGY);
                        if (r == ERR_NOT_IN_RANGE) {creep.moveTo(storage);}
                        else if (r == ERR_NOT_ENOUGH_RESOURCES) return false;
                    }
                }
            } else {

                if (storage) {
                    // transfer all resources different to RESOURCE_ENERGY to storage
                    const creepResources = Object.keys(creep.store);
                    for (let i in creepResources) {
                        if (creepResources[i] != RESOURCE_ENERGY) {
                            const r = creep.transfer(storage, creepResources[i] as ResourceConstant);
                            if (r == ERR_NOT_IN_RANGE) creep.moveTo(storage);
                            else if (r == ERR_FULL) creep.drop(creepResources[i] as ResourceConstant);
                        }

                    }
                }
            }
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
            */

            // find then closest target(extension or spawn)

            const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: s => ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0))
            })
            if (!target) {
                if (creep.store.getUsedCapacity() > 0) {
                    creep.memory.ending = true;
                    creep.memory.task.status = "TaskDone";
                } else {
                    creep.memory.task.status = "Idle";
                }

                return true;
            }
            creep.moveTo(target.pos)
            const result = creep.transfer(target, RESOURCE_ENERGY)
            if (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_FULL) return true
            else if (result != OK && result != ERR_NOT_IN_RANGE) creep.say(`拓展填充 ${result}`)

            return creep.store[RESOURCE_ENERGY] === 0;

        }

    },
    MOVE: {
        source: (creep:Creep) => {
            const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
            const task = logisticStationMem.getTaskWithId("MOVE", creep.memory.task.id);
            /** check if task exist **/
            if (!existTask("MOVE", creep)) {
                return false;
            }
            /** exist task, check target object **/
            const creepName = task.taskObjectInfo.id;
            const objectCreep = Game.creeps[creepName];

            if (!objectCreep) {     // no objectCreep, taskDone, execute ending stage if needed

                creep.memory.ending = true;
                creep.memory.task.status = "TaskDone";
                return false;
            }

            /** task exist, objectCreep exist, check if creep is near to objectCreep **/
            if (!creep.pos.isNearTo(objectCreep)) {
                creep.moveTo(objectCreep.pos);
                return false;
            }
            /** if creep is near to objectCreep, wait to get storage full **/
            //check if creep storage is full
            if (creep.store.getFreeCapacity() <= 0) {
                creep.memory.ending = true;
                creep.memory.task.status = "TaskDone";
            }
            return false;

            //return creep.store.getFreeCapacity() == 0;
        },
        target: (creep:Creep) => {
            // //creep.say('💤');
            // const logisticMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType);
            // const storageID = logisticMem.getStorageId()
            // const storage = Game.getObjectById(storageID as Id<StructureStorage> );
            //
            // const resourceType = Object.keys(creep.store)[0] as ResourceConstant;
            // if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(storage);
            // }
            //return creep.store.getUsedCapacity() == 0;
            return true
        }

    },
    TRANSFER: {
        source: (creep:Creep) => {

            const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
            const task = logisticStationMem.getTaskWithId("TRANSFER", creep.memory.task.id);
            /** check if task exist **/
            if (!existTask("TRANSFER", creep)) {
                return false;
            }
            /** check if storage exist **/
            const storageId = logisticStationMem.getStorageId()
            const storage = Game.getObjectById(storageId as Id<StructureStorage> | Id<StructureContainer> | Id<StructureSpawn>);
            if (!storage) {
                creep.memory.ending = true;
                creep.memory.task.status = "TaskDone";
                return false;
            }
            /** check if target structure exist **/
            const targetStructure = Game.getObjectById(task.taskObjectInfo.id as Id<StructureStorage>);
            if (!targetStructure) {
                creep.memory.ending = true;
                creep.memory.task.status = "TaskDone";
                return false;
            }


            let amount = Math.min(task.amount, creep.store.getFreeCapacity(task.resourceType));
            if (!task.amount) amount = creep.store.getFreeCapacity(task.resourceType);
            /** check storage have enough resource **/
            if (storage.store.getUsedCapacity(task.resourceType) > 250) {
                // get min between task.amount and creep.store.getFreeCapacity(task.resourceType)
                const r = creep.withdraw(storage, task.resourceType, amount);
                if (r == ERR_NOT_IN_RANGE) creep.moveTo(storage);

            }

            return creep.store.getUsedCapacity() >= amount;
        },
        target: (creep:Creep) => {

            const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
            const task = logisticStationMem.getTaskWithId("TRANSFER", creep.memory.task.id);

            /** check if task exist **/
            if (!existTask("TRANSFER", creep)) {
                return false;
            }
            /** check if target structure exist **/
            const targetStructure = Game.getObjectById(task.taskObjectInfo.id as Id<StructureStorage>);
            if (!targetStructure) {
                creep.memory.ending = true;
                creep.memory.task.status = "TaskDone";
                return false;
            }

            /** transfer resource **/
            const r = creep.transfer(targetStructure, task.resourceType);
            if (r == ERR_NOT_IN_RANGE) { creep.moveTo(targetStructure); return false }
            else {
                creep.memory.task.status = "TaskDone";
                creep.memory.ending = true;

                return true;
            }


            //return creep.store.getUsedCapacity() == 0;
        }

    },
    WITHDRAW: {

        source: (creep: Creep) => {
            const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
            const task = logisticStationMem.getTaskWithId("WITHDRAW", creep.memory.task.id);

            /** check if task exist **/
            if (!existTask("WITHDRAW", creep)) {
                return false;
            }

            /** move to target room **/
            if (creep.room.name != task.taskObjectInfo.roomName) {
                const pos = new RoomPosition(task.taskObjectInfo.pos[0], task.taskObjectInfo.pos[1], task.taskObjectInfo.roomName)
                creep.moveTo(pos);
                return false;
            }

            /** check if target structure exist **/
            const structure = Game.getObjectById(task.taskObjectInfo.id as Id<StructureStorage> | Id<StructureContainer> | Id<StructureLink>);
            if (!structure) {
                creep.memory.ending = true;
                creep.memory.task.status = "TaskDone";
                return false;
            }

            /** withdraw or move to target **/
            const r = creep.withdraw(structure, task.resourceType);
            if (r == ERR_NOT_IN_RANGE) { creep.moveTo(structure); return false}
            else {
                creep.memory.task.status = "TaskDone";
                creep.memory.ending = true;

                return false;
            }

            //return creep.store.getFreeCapacity() <= 0;
        },
        target: (creep: Creep) => {

            const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
            const storageId = logisticStationMem.getStorageId()
            const storage = Game.getObjectById(storageId as Id<StructureStorage> | Id<StructureContainer> | Id<StructureSpawn>);
            if (storage) {
                const creepResources = Object.keys(creep.store)[0];
                creep.say(creepResources)
                if (creepResources) {
                    const r = creep.transfer(storage, creepResources as ResourceConstant);
                    if (r == ERR_NOT_IN_RANGE) {creep.moveTo(storage); return false; }
                    if(r == OK) {
                        creep.memory.task.status = "Done";
                        return true;
                    }
                }
            } else {
                console.log(creep.memory.roomName + ': ERROR: no storage in logistic station')
                creep.memory.task.status = "Done";
                return true;
            }

            // other case
            creep.memory.task.status = "Done";
            return true;

        }

    }

}


export default transporterRole;

