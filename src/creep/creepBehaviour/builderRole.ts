import {ColonyStatus} from "@/colony/colonyStatus";

const builderRole:{
    [role in BuilderRole]: (data: {}) => ICreepConfig
} = {
    builder: (data: BuilderTaskData): ICreepConfig => ({

        source: (creep: Creep): boolean => {
            if(data.constructionSiteInfo.roomName) {

                const roomPos = new RoomPosition(data.constructionSiteInfo.pos[0], data.constructionSiteInfo.pos[1], data.constructionSiteInfo.roomName);
                if(creep.room.name == data.constructionSiteInfo.roomName) {
                    const constructionSide = Game.getObjectById(data.constructionSiteInfo.id as Id<ConstructionSite>)
                    if (constructionSide) {
                        // move to the target if exists
                        const colonyStatus = new ColonyStatus(creep.memory.roomName);
                        const storageID = colonyStatus.getStorageID();
                        const storage = Game.getObjectById(storageID as Id<Structure>);
                        const rValue = creep.withdraw(storage, 'energy');
                        if(rValue == ERR_NOT_IN_RANGE) creep.moveTo(storage);
                        return creep.store.getFreeCapacity() <= 0
                    } else {
                        // otherwise, try to find the target
                        const closeConstructionSide = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                        if (closeConstructionSide) {
                            //console.log(creep.memory['task']['target']['id']);
                            data.constructionSiteInfo.id = closeConstructionSide.id;
                            data.constructionSiteInfo.roomName = closeConstructionSide.room.name;
                            data.constructionSiteInfo.pos[0] = closeConstructionSide.pos.x;
                            data.constructionSiteInfo.pos[1] = closeConstructionSide.pos.y;
                            return false;
                        } else {
                            // no construction side found, sleep
                            creep.say('zzz...')
                            return false;
                        }

                    }
                }
                else {
                    creep.moveTo(roomPos);
                    return false;
                }
            }

            return false;
        },
        target: (creep: Creep): boolean => {

            const constructionSide = Game.getObjectById(data.constructionSiteInfo.id as Id<ConstructionSite>);
            if (constructionSide) {
                if (creep.build(constructionSide) == ERR_NOT_IN_RANGE) creep.moveTo(constructionSide);
                return creep.store.getUsedCapacity() == 0;
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