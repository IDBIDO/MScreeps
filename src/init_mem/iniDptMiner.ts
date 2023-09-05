import {RoomPlanningMem} from "@/access_memory/roomPlanningMem";


export function iniStationMiner(roomName: string, stationName: string) {
    if (!Memory['colony'][roomName]['dpt_miner']) Memory['colony'][roomName]['dpt_miner'] = {};
    if (!Memory['colony'][roomName]['dpt_miner'][stationName]) Memory['colony'][roomName]['dpt_miner'][stationName] = {};


    const roomPlanningMem = new RoomPlanningMem(roomName);

    let num = 0;
    if (stationName === 'source1') num = 0;
    else if (stationName === 'source2') num = 1;
    else if (stationName === 'mineral') num = 2;

    const sourceID_Room_position = roomPlanningMem.getSourceID_Room_position(num);

    let iniMem: HarvestStationMemory = {
        creepConfig: {
            body: {
                work: 2,
                carry: 1,
                move: 1,
            },
            priority: 1,
            creepMemory: {
                role: "miner",

                working: false,
                ready: false,
                dontPullMe: true,

                workStationID: stationName,
                departmentName: "dpt_miner",
                roomName: roomName,
            }
        },
        creepDeadTick: {},
        order: [],
        task: [],
        usage: {sourceInfo: sourceID_Room_position, targetInfo: {id: null, roomName: null, pos: null}}

    }

    let auxRoomPos = new RoomPosition(sourceID_Room_position.pos[0], sourceID_Room_position.pos[1], roomName);
    let adjPosList: RoomPosition[] = auxRoomPos['getAdjacentPositions']();
    for (let i in adjPosList) {
        let auxPos = adjPosList[i];
        if (auxPos['isWalkable']())
            iniMem.task.push([auxPos.x, auxPos.y, 0]);

    }
    Memory['colony'][roomName]['dpt_miner'][stationName] = iniMem;

}

export function iniDptHarvest(roomName: string) {
    Memory['colony'][roomName]['dpt_miner'] = {};
    iniStationMiner(roomName, 'mineral');


}