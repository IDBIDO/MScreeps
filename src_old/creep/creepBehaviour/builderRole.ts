import {ColonyStatus} from "@/colony/colonyStatus";
import { LogisticWorkStation } from "@/workStation/logisticWorkStation";
import { SendOrder } from "@/workStation/sendOrder";

export function checkTransferTaskSent(creep: Creep) {
    const logisitcStation = new LogisticWorkStation(creep.memory.roomName, 'internal');
    if (logisitcStation.exitsTask('TRANSFER', creep.name)) {
        // task already sent
        return;
    }
    else {
        //send transfer task
        const sendOrder = new SendOrder(creep.memory.roomName);
        const data: ID_Room_position = {
            roomName: creep.memory.roomName,
            pos: [creep.pos.x, creep.pos.y],
            id: creep.id
        }
        const taskData: TransporterTaskData = {
            amount: creep.store.getFreeCapacity(),
            resourceType: RESOURCE_ENERGY,
            stationDpt: creep.memory.departmentName,
            stationId: creep.name,
            taskObjectInfo: data,
            taskType: 'TRANSFER',
            transporterCreepName: null
        }
        sendOrder.logistic_sendOrder('internal', 'ADD_TASK', taskData);
    }

}

const builderRole:{
    [role in BuilderRole]: (data: {}) => ICreepConfig
} = {
    builder: (data: BuilderTaskData): ICreepConfig => ({

        source: (creep: Creep): boolean => {

            // check if creep has construction side to build
            if (data.constructionSiteInfo.id) {
                // check if same room
                if (creep.room.name == data.constructionSiteInfo.roomName) {
                    // same room, check if construction side still exist
                    const constructionSite = Game.getObjectById(data.constructionSiteInfo.id as Id<ConstructionSite>);
                    if (constructionSite) {
                        // construction side still exist, build it
                        if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
                            return false;
                        }
                        return true;
                    } else {
                        // construction side not exist, clear data
                        data.constructionSiteInfo.id = null;
                        data.constructionSiteInfo.roomName = null;
                        data.constructionSiteInfo.pos = null;
                        return false;
                    }
                } else {
                    // not same room, move to the room
                    const roomPos = new RoomPosition(data.constructionSiteInfo.pos[0], data.constructionSiteInfo.pos[1], data.constructionSiteInfo.roomName);
                    creep.moveTo(roomPos);
                    return false;
                }
            } else {
                const closeConstructionSide = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (closeConstructionSide) {
                    //console.log(creep.memory['task']['target']['id']);
                    data.constructionSiteInfo.id = closeConstructionSide.id;
                    data.constructionSiteInfo.roomName = closeConstructionSide.room.name;
                    data.constructionSiteInfo.pos = [closeConstructionSide.pos.x, closeConstructionSide.pos.y];

                    return false;
                } else {
                    // no construction side found, sleep
                    creep.say('zzz...')
                    return false;
                }
            }


            return false;
        },
        target: (creep: Creep): boolean => {

            const constructionSide = Game.getObjectById(data.constructionSiteInfo.id as Id<ConstructionSite>);
            if (constructionSide) {
                const r = creep.build(constructionSide);
               //console.log(r)
                if (r == ERR_NOT_IN_RANGE) creep.moveTo(constructionSide);
                else if (r == ERR_NOT_ENOUGH_RESOURCES) {
                    checkTransferTaskSent(creep);
                }
                return false;       // construction side still exist
            }


            // constructionSide not exist
            return true;
        }
    }),


    supporter: (data: BuilderTaskData): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            return false;
        },
        target: (creep: Creep): boolean => {
            return false;
        }
    })

}
export default builderRole;