import {LogisticWorkStation} from "@/workStation/logisticWorkStation";

export function sendTaskRequest(creep: Creep) {
    const logisticStation = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID']);
    logisticStation.addAvailableCreep(creep.name);
}

const transporterRole:{
    [role in TransporterRoleConstant]: (data: {}) => ICreepConfig
} = {

    transporter: (data: CreepTask): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            if (data.taskID != null) {
                return transferTaskOperations[data.taskType].source(creep);
            }
            else {
                sendTaskRequest(creep);
            }

            return true;
        },

        target: (creep: Creep): boolean => {
            if (data.taskID != null) {
                return transferTaskOperations[data.taskType].target(creep);
            }
            return true;
        }
    })

}


export const transferTaskOperations: { [task in LogisticTaskType]: transferTaskOperation
} = {
    FILL: {
        source: (creep:Creep) => {
            const creepTask: CreepTask = creep.memory['creepTask'];
            // @ts-ignore
            const source = Game.getObjectById(creepTask.sourceInfo.id);
            //@ts-ignore
            if (creep.withdraw(source, 'energy') == ERR_NOT_IN_RANGE) { //@ts-ignore
                creep.moveTo(source);
            }

            return creep.store.getFreeCapacity() <= 0;
        },
        target: (creep:Creep) => {
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

                    const logisticStation = new LogisticWorkStation(creep.memory['roomName'], creep.memory['workStationID']);
                    logisticStation.removeTemporalTask(creepTask.taskID);
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


            return false;
        }

    },
    MOVE: {
        source: (creep:Creep) => {
            creep.say('💤');
            return false;
        },
        target: (creep:Creep) => {

            return false;
        }

    },
    TRANSFER: {
        source: (creep:Creep) => {

            return false;
        },
        target: (creep:Creep) => {

            return false;
        }

    },
    WITHDRAW: {

        source: (creep: Creep) => {

            return creep.store.getFreeCapacity() <= 0;
        },
        target: (creep: Creep) => {

            return false;

        }

    }

}
export default transporterRole;

