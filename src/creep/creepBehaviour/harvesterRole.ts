import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";
import {ColonyStatus} from "@/colony/colonyStatus";

export function checkCreepTask(creep: Creep, data: HarvesterTaskData):void {
    if (data.workPosition == null) {
        const station = new HarvesterWorkStation(creep.memory.roomName, creep.memory.workStationID as StationType);
        station.giveTaskTo(data);
        console.log(data.workPosition);
    }
}

const harvesterRole:{
    [role in HarvesterRole]: (data: {}) => ICreepConfig
} = {
    harvester: (data: HarvesterTaskData): ICreepConfig => ({
        source: (creep: Creep): boolean => {

            checkCreepTask(creep, data);
            /*
            if (creep.harvest(Game.getObjectById(data.sourceInfo.id as Id<Source>)) === ERR_NOT_IN_RANGE) {
                const pos = new RoomPosition(data.workPosition[0], data.workPosition[1], data.targetInfo.roomName);
                //console.log(pos)
                creep.moveTo(pos);
            }
            */

            const pos = new RoomPosition(data.workPosition[0], data.workPosition[1], data.targetInfo.roomName);
            if (creep.pos.isEqualTo(pos)) {
                creep.harvest(Game.getObjectById(data.sourceInfo.id as Id<Source>) as Source);
            } else {creep.moveTo(pos);}
            //console.log('source')
            return creep.store.getFreeCapacity() <= 0


        },
        target: (creep: Creep): boolean => {
            if (data.targetInfo.id == null) {
                // wait for adjacent transporte
                const roomPos = new RoomPosition(creep.pos.x, creep.pos.y, data.sourceInfo.roomName);
                const colonyStatus = new ColonyStatus(data.sourceInfo.roomName);
                const fase = colonyStatus.getFase();
                // if fase 0, wait for adjacent transporter
                let found = false;
                if (fase == 0) {
                    const adjPos = roomPos['getAdjacentPositions']();
                    //console.log(adjPos)
                    for (let i = 0; i < adjPos.length && creep.store.getUsedCapacity(); ++i) {
                        //console.log(adjPos[i])
                        const aux = new RoomPosition(adjPos[i].x, adjPos[i].y, adjPos[i].roomName);
                        const creeps = aux.lookFor(LOOK_CREEPS);

                        if (creeps.length && creeps[0].memory.role == 'transporter') {
                            creep.transfer(creeps[0], RESOURCE_ENERGY);
                            found = true;

                            //console.log(creep.store)
                            //console.log('transfer')
                        }
                    }
                }
                // if not found, search for construction site
               if (found == false) {
                   const adjPos = roomPos['getAdjacentPositions']();
                   let found = false;
                     for (let i = 0; i < adjPos.length; ++i) {
                         const constructionSites = adjPos[i].lookFor(LOOK_CONSTRUCTION_SITES);
                            if (constructionSites.length) {
                                creep.build(constructionSites[0]);
                                found = true;
                            }
                     }

               }

            }
            else {

                const target = Game.getObjectById(data.targetInfo.id as Id<Structure>);

                const r = creep.transfer(target, 'energy');
                if (r == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }

            }

            return creep.store.getUsedCapacity() == 0;
        }
    }),
    initializer: (data: HarvesterTaskData): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            return true;
        },
        target: (creep: Creep): boolean => {
            return true;
        }
    })

}
export default harvesterRole;
