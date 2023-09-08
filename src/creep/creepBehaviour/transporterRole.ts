
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
export function emptyStorageOperation(creep: Creep, needDrop: boolean) {
    const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
    const storageId = logisticStationMem.getStorageId()
    if (storageId) {
        const storage = Game.getObjectById(storageId as Id<StructureStorage> | Id<StructureContainer>);
        if (storage) {
            const creepStorage = Object.keys(creep.store) as ResourceConstant[]
            if (creepStorage[0]) {
                const result = creep.transfer(storage, creepStorage[0]);

                if (result == ERR_NOT_IN_RANGE) creep.moveTo(storage);
                else if (needDrop && result == ERR_FULL) creep.drop(creepStorage[0]);
            }
        }
    }

}

const transporterRole:{
    [role in TransporterRole]: () => ICreepConfig
} = {

    transporter: (): ICreepConfig => ({

        source: (creep: Creep): boolean => {
            // check check live time
            //if (creep.ticksToLive < 30) deadOperation(creep);

            if (creep.memory.task.status == "InProcess") {
                // TODO FOR EACH TASK TYPE MAKE CREEP EMPTY STORAGE
                return transferTaskOperations[creep.memory.task.type].source(creep);
            }
            else {
                if (creep.store.getUsedCapacity() > 0) emptyStorageOperation(creep, false);

                //sendTaskRequest(creep);
                //console.log('TASK!!!');
                return false;
            }


        },

        target: (creep: Creep): boolean => {
            //if (creep.ticksToLive < 3) deadOperation(creep);
            if (creep.memory.task.status == "InProcess") {
                return transferTaskOperations[creep.memory.task.type].target(creep);
            }
            //console.log('waiting for task');

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
                creep.memory.task.status = "Done";
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
                        if (r == ERR_NOT_IN_RANGE) creep.moveTo(storage);
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
            if (!target) return true;

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
            if (!task) {
                creep.memory.task.status = "Done";
                return false;
            }
            else {
                const creepName = task.taskObjectInfo.id;
                const objectCreep = Game.creeps[creepName];
                if (objectCreep) {
                    if (!creep.pos.isNearTo(objectCreep)) {
                        creep.moveTo(objectCreep.pos);
                        return false;
                    }
                    //if creep is near to objectCreep, wait to get storage full

                } else {        // creep likely to be dead
                    creep.memory.task.status = "Done";
                    return false;

                }
            }


            // let taskLocation = creep.memory['taskData'] as TransporterTaskLocation;
            // const logisticDPT = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID'] as StationType);
            // const taskData = logisticDPT.getTaskData(taskLocation.taskType, taskLocation.stationId);
            //
            //
            // if (!taskData) {
            //     //taskData = null;    // 任务完成
            //     //creep.memory['taskData'] = null;
            //     creep.memory.taskData['taskType'] = null;
            //     creep.memory.taskData['stationId'] = null;
            //     //deleteTask(creep);
            //     return false;
            // }
            //
            // else {
            //     const creepName = getFullStorageCreepForMOVE(taskData.stationDpt, taskData.stationId, creep.memory['roomName']);
            //     if (creepName) {
            //         const objectCreep = Game.creeps[creepName];
            //         if (!creep.pos.isNearTo(objectCreep)) {
            //             creep.moveTo(objectCreep.pos);
            //             //return false;
            //         }
            //     }
            // }
            //
            // //creep.say('💤');
            return creep.store.getFreeCapacity() == 0;
        },
        target: (creep:Creep) => {
            //creep.say('💤');
            const logisticMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType);
            const storageID = logisticMem.getStorageId()
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

            const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
            const task = logisticStationMem.getTaskWithId("TRANSFER", creep.memory.task.id);
            if (!task) {
                creep.memory.task.status = "Done";
                return false;
            }
            else {
                const storageId = logisticStationMem.getStorageId()
                const storage = Game.getObjectById(storageId as Id<StructureStorage> | Id<StructureContainer> | Id<StructureSpawn>);
                if (storage && storage.store.getFreeCapacity(task.resourceType) > 250) {
                    const targetStructure = Game.getObjectById(task.taskObjectInfo.id as Id<StructureStorage>);
                    if (!targetStructure) {
                        creep.memory.task.status = "Done";
                        return false;
                    }
                    // get max between task.amount and creep.store.getFreeCapacity(task.resourceType)
                    const amount = Math.min(task.amount, creep.store.getFreeCapacity(task.resourceType));
                    const r = creep.withdraw(storage, task.resourceType, amount);
                    if (r == ERR_NOT_IN_RANGE) creep.moveTo(storage);

                } else {
                    if (!storage)
                        console.log(creep.memory.roomName + ': ERROR: no storage in logistic station')
                    creep.memory.task.status = "Done";
                    return false;
                }
            }

            // let taskLocation = creep.memory['taskData'] as TransporterTaskLocation;
            // const logisticDPT = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID'] as StationType);
            // const taskData = logisticDPT.getTaskData(taskLocation.taskType, taskLocation.stationId);
            //
            // const colonyStatus = new ColonyStatus(creep.memory['roomName']);
            // const storageID = colonyStatus.getStorageID();
            // // PRE:  storage exist
            // const storage = Game.getObjectById(storageID as Id<StructureStorage> );
            //
            // const r = creep.withdraw(storage, taskData.resourceType, taskData.amount);
            // if (r == ERR_NOT_IN_RANGE) creep.moveTo(storage);

            return creep.store.getFreeCapacity() == 0;
        },
        target: (creep:Creep) => {

            const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
            const task = logisticStationMem.getTaskWithId("TRANSFER", creep.memory.task.id);
            if (!task) {
                creep.memory.task.status = "Done";
                return true;
            } else {
                const targetStructure = Game.getObjectById(task.taskObjectInfo.id as Id<StructureStorage>);
                if (!targetStructure) {
                    creep.memory.task.status = "Done";
                    return true;
                }
                const r = creep.transfer(targetStructure, task.resourceType);
                if (r == ERR_NOT_IN_RANGE) { creep.moveTo(targetStructure); return false }
                else if (r == OK) {
                    creep.memory.task.status = "Done";
                    return true;
                }
            }


            //return creep.store.getUsedCapacity() == 0;
        }

    },
    WITHDRAW: {

        source: (creep: Creep) => {
            const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
            const task = logisticStationMem.getTaskWithId("WITHDRAW", creep.memory.task.id);
            if (!task) {
                creep.memory.task.status = "Done";
                return false;
            } else {
                // move to target room
                if (creep.room.name != task.taskObjectInfo.roomName) {
                    const pos = new RoomPosition(task.taskObjectInfo.pos[0], task.taskObjectInfo.pos[1], task.taskObjectInfo.roomName)
                    creep.moveTo(pos);
                    return false;
                }
                // withdraw or move to target
                const structure = Game.getObjectById(task.taskObjectInfo.id as Id<StructureStorage>);
                if (structure) {
                    const r = creep.withdraw(structure, task.resourceType);
                    if (r == ERR_NOT_IN_RANGE) creep.moveTo(structure);
                    else if (r == OK) {
                        return true;
                    }
                }
            }

            // let taskLocation = creep.memory['taskData'] as TransporterTaskLocation;
            // const logisticDPT = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID'] as StationType);
            // const taskData = logisticDPT.getTaskData(taskLocation.taskType, taskLocation.stationId);
            //
            // // move to target room
            // if (creep.room.name != taskData.taskObjectInfo.roomName) {
            //     const pos = new RoomPosition(taskData.taskObjectInfo.pos[0], taskData.taskObjectInfo.pos[1], taskData.taskObjectInfo.roomName)
            //     creep.moveTo(pos);
            //     return false;
            // }
            //
            // // withdraw or move to target
            // const structure = Game.getObjectById(taskData.taskObjectInfo.id as Id<StructureStorage>);
            // if (structure) {
            //     const r = creep.withdraw(structure, taskData.resourceType);
            //     if (r == ERR_NOT_IN_RANGE) creep.moveTo(structure);
            //     else if (r == OK) {
            //         // if withdraw success, realise the task
            //         taskData.transporterCreepName = null;       //avise logisticDPT that the task is done
            //
            //     }
            // }



            return creep.store.getFreeCapacity() <= 0;
        },
        target: (creep: Creep) => {

            const logisticStationMem = new LogisticStationMem(creep.memory.roomName, creep.memory.workStationID as LogisticStationType)
            const storageId = logisticStationMem.getStorageId()
            const storage = Game.getObjectById(storageId as Id<StructureStorage> | Id<StructureContainer> | Id<StructureSpawn>);
            if (storage) {
                const creepResources = Object.keys(creep.store)[0];
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

            // const colonyStatus = new ColonyStatus(creep.memory['roomName']);
            // const storageID = colonyStatus.getStorageID();
            // // PRE:  storage exist
            // const storage = Game.getObjectById(storageID as Id<StructureStorage> );
            //
            // const creepResources = Object.keys(creep.store)[0]
            //
            // if (creepResources) {
            //     const r = creep.transfer(storage, creepResources as ResourceConstant);
            //     if (r == ERR_NOT_IN_RANGE) {creep.moveTo(storage); return false; }
            //     if(r == OK) {
            //         creep.memory.taskData['taskType'] = null;
            //         creep.memory.taskData['stationId'] = null;
            //     }
            //     return true;
            // }
            // // creep storage empty,
            // creep.memory.taskData['taskType'] = null;
            // creep.memory.taskData['stationId'] = null;
            // return true;

        }

    }

}
export default transporterRole;

