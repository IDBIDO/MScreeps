import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";
import {ColonyStatus} from "@/colony/colonyStatus";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";

export function checkCreepTask1(creep: Creep, data: HarvesterTaskData):void {
    if (data.workPosition == null) {
        const station = new HarvesterWorkStation(creep.memory.roomName, creep.memory.workStationID as StationType);
        //station.giveTaskTo(data);
        console.log('harvester creep work position: ' + data.workPosition);
    }
}

export function checkCreepTask(creep: Creep): void {
    if (creep.memory.taskData['workPosition'] == null) {
        const station = new HarvesterWorkStation(creep.memory.roomName, creep.memory.workStationID as StationType);
        station.giveTaskTo(creep);
       // console.log('harvester creep work position: ' + data.workPosition);
    }
}

const harvesterRole:{
    [role in HarvesterRole]: (data: {}) => ICreepConfig
} = {
    harvester: (data: HarvesterTaskData): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            checkCreepTask(creep);
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
            const harvesterWS = new HarvesterWorkStation(creep.memory.roomName, creep.memory.workStationID as StationType)
            const targetInfo = harvesterWS.getTargetInfo();
            const sourceInfo = harvesterWS.getSourceInfo();
            if (targetInfo.id == null) {
                // wait for adjacent transporter
                const roomPos = new RoomPosition(creep.pos.x, creep.pos.y, sourceInfo.roomName);
                const colonyStatus = new ColonyStatus(sourceInfo.roomName);
                const fase = colonyStatus.getFase();
                const rcl = colonyStatus.getBuildRCL();
                // if fase 0, wait for adjacent transporter
                let found = false;
                if (fase == 0 && rcl == 0) {
                    const adjPos = roomPos['getAdjacentPositions']();
                    //console.log(adjPos)
                    for (let i = 0; i < adjPos.length && creep.store.getUsedCapacity(); ++i) {
                        //console.log(adjPos[i])
                        const aux = new RoomPosition(adjPos[i].x, adjPos[i].y, adjPos[i].roomName);
                        const creeps = aux.lookFor(LOOK_CREEPS);

                        if (creeps.length && creeps[0].memory.role == 'transporter') {
                            creep.transfer(creeps[0], RESOURCE_ENERGY);
                            found = true;
                            console.log('transporter found')

                        }
                    }
                    if (!found) {
                        // search for constructionSide
                        const roomPlanning = new RoomPlanningMem(creep.memory.roomName);
                        let pos: [number, number];
                        if (creep.memory.workStationID == 'source1') pos = roomPlanning.getContainerSource1Data().pos
                        else pos = roomPlanning.getContainerSource2Data().pos;
                        const roomPos = new RoomPosition(pos[0], pos[1], creep.memory.roomName);
                        const constructionSideList = roomPos.lookFor(LOOK_CONSTRUCTION_SITES);
                        if (constructionSideList.length > 0) {
                            creep.build(constructionSideList[0]);
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

                const target = Game.getObjectById(targetInfo.id as Id<Structure>);

                const r = creep.transfer(target, 'energy');
                if (r == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {ignoreCreeps: false});
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

