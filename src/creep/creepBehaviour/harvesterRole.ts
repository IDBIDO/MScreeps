// import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";
// import {ColonyStatus} from "@/colony/colonyStatus";
// import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
// import { SendOrder } from "@/workStation/sendOrder";

import {HarvestStationMem} from "@/access_memory/harvestStationMem";

// export function checkCreepTask1(creep: Creep, data: HarvesterTaskData):void {
//     if (data.workPosition == null) {
//         const station = new HarvesterWorkStation(creep.memory.roomName, creep.memory.workStationID as StationType);
//         //station.giveTaskTo(data);
//         console.log('harvester creep work position: ' + data.workPosition);
//     }
// }
//
// export function checkCreepTask(creep: Creep): void {
//     if (creep.memory.taskData['workPosition'] == null) {
//         const station = new HarvesterWorkStation(creep.memory.roomName, creep.memory.workStationID as StationType);
//         station.giveTaskTo(creep);
//        // console.log('harvester creep work position: ' + data.workPosition);
//     }
// }
//
// export function creepDeadAction(creep: Creep): void {
//     if (creep.ticksToLive < 5) {
//         const sendOrder = new SendOrder(creep.memory.roomName);
//         sendOrder.harvester_sendOrder(creep.memory.workStationID as StationType,
//             'UNSET_WORK_POSITION', {workPosition: creep.memory.taskData['workPosition']} );
//         creep.suicide();
//     }
// }

export function getUsage(roomName: string, stationType: HarvestStationType): {
    sourceInfo: ID_Room_position;
    targetInfo: ID_Room_position;
} {
    const harvesterMem = new HarvestStationMem(roomName, stationType);
    return harvesterMem.getUsage();
}



const harvesterRole:{
    [role in HarvesterRole]: () => ICreepConfig
} = {
    harvester: (): ICreepConfig => ({
        source: (creep: Creep): boolean => {

            const usage = getUsage(creep.memory.roomName, creep.memory.workStationID as HarvestStationType)
            const creepTaskPos = creep.memory.task as number[];
            if (!creepTaskPos) { creep.say("Task, I want task!!!"); return ;}

            const pos = new RoomPosition(creepTaskPos[0], creepTaskPos[1], creep.memory.roomName);
            const source = Game.getObjectById(usage.sourceInfo.id as Id<Source>);


            // if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(pos);
            // }

            if (creep.pos.isEqualTo(pos)) {
                 creep.harvest(source);
            } else {creep.moveTo(pos);}
            // //console.log('source')
            return creep.store.getFreeCapacity() <= 0


        },
        target: (creep: Creep): boolean => {
            //creepDeadAction(creep);

            const usage = getUsage(creep.memory.roomName, creep.memory.workStationID as HarvestStationType)
            //const harvesterWS = new HarvesterWorkStation(creep.memory.roomName, creep.memory.workStationID as StationType)
            const targetInfo = usage.targetInfo
            const sourceInfo = usage.targetInfo

            const targetObject = Game.getObjectById(targetInfo.id as Id<Structure> | Id<ConstructionSite>);
            if (targetObject instanceof ConstructionSite) {
                // wait for adjacent transporter

                const roomPos = new RoomPosition(creep.pos.x, creep.pos.y, sourceInfo.roomName);

                let found = false;

                const adjPos = roomPos['getAdjacentPositions']();
                //console.log(adjPos)
                for (let i = 0; i < adjPos.length && creep.store.getUsedCapacity(); ++i) {
                    //console.log(adjPos[i])
                    const aux = new RoomPosition(adjPos[i].x, adjPos[i].y, adjPos[i].roomName);
                    const creeps = aux.lookFor(LOOK_CREEPS);

                    if (creeps.length && creeps[0].memory.role == 'transporter') {
                        if (creep.transfer(creeps[0], RESOURCE_ENERGY) == OK)  found = true;
                        //console.log('transporter found')

                    }
                }
                if (!found) {
                    // search for constructionSide
                    const pos = usage.targetInfo.pos
                    const roomPos = new RoomPosition(pos[0], pos[1], creep.memory.roomName);
                    const constructionSideList = roomPos.lookFor(LOOK_CONSTRUCTION_SITES);
                    if (constructionSideList.length > 0) {
                        creep.build(constructionSideList[0]);
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
    miner: (): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            return false;
        },
        target: (creep: Creep): boolean => {
            return false;
        }

    }),





}
export default harvesterRole;

