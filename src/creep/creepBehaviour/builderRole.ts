
import {BuildStationMem} from "@/access_memory/buildStationMem";

// export function checkTransferTaskSent(creep: Creep) {
//     const logisitcStation = new LogisticWorkStation(creep.memory.roomName, 'internal');
//     if (logisitcStation.exitsTask('TRANSFER', creep.name)) {
//         // task already sent
//         return;
//     }
//     else {
//         //send transfer task
//         const sendOrder = new SendOrder(creep.memory.roomName);
//         const data: ID_Room_position = {
//             roomName: creep.memory.roomName,
//             pos: [creep.pos.x, creep.pos.y],
//             id: creep.id
//         }
//         const taskData: TransporterTaskData = {
//             amount: creep.store.getFreeCapacity(),
//             resourceType: RESOURCE_ENERGY,
//             stationDpt: creep.memory.departmentName,
//             stationId: creep.name,
//             taskObjectInfo: data,
//             taskType: 'TRANSFER',
//             transporterCreepName: null
//         }
//         sendOrder.logistic_sendOrder('internal', 'ADD_TASK', taskData);
//     }
//
// }

export function getHighestPriorityTask(roomName: string, stationType: BuildStationType): BuildTaskData {
    const buildStationMem = new BuildStationMem(roomName, stationType);
    return buildStationMem.getHighPriorityBuildTask();
}

const builderRole:{
    [role in BuilderRole]: () => ICreepConfig
} = {
    builder: (): ICreepConfig => ({

        source: (creep: Creep): boolean => {
            const buildTaskData = getHighestPriorityTask(creep.memory.roomName, creep.memory.workStationID as BuildStationType);
            //creep.say(buildTaskData.id)
            if (!buildTaskData) {               // No task
                creep.say('No task');
                return false;
            }
            const constructionSide = Game.getObjectById(buildTaskData.id as Id<ConstructionSite>);
            if (!constructionSide) {            // construction side not exist
                creep.say('No construction side');
                return false;
            } else {
                if (creep.pos.getRangeTo(constructionSide) > 2) {
                    creep.moveTo(constructionSide);
                } else {
                    if (creep.store.getUsedCapacity() > 0) {
                        const r = creep.build(constructionSide);

                    }
                }
            }

            return false;
        },
        target: (creep: Creep): boolean => {
            return true;
        }
    }),


    repairer: (): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            return false;
        },
        target: (creep: Creep): boolean => {
            return false;
        }
    })

}
export default builderRole;