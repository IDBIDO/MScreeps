import {RoomPlanningMem} from "@/access_memory/roomPlanningMem";


export function iniStationHarvest(roomName: string, stationName: string) {
    if (!Memory['colony'][roomName]['dpt_harvest']) Memory['colony'][roomName]['dpt_harvest'] = {};
    if (!Memory['colony'][roomName]['dpt_harvest'][stationName]) Memory['colony'][roomName]['dpt_harvest'][stationName] = {};


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
                role: "harvester",

                working: false,
                ready: false,
                dontPullMe: true,

                workStationID: stationName,
                departmentName: "dpt_harvest",
                roomName: roomName,
                task: null
            }
        },
        creepDeadTick: {},
        order: [],
        task: [],
        usage: {sourceInfo: sourceID_Room_position, targetInfo: {id: null, roomName: roomName, pos: null}}

    }

    let auxRoomPos = new RoomPosition(sourceID_Room_position.pos[0], sourceID_Room_position.pos[1], roomName);
    let adjPosList: RoomPosition[] = auxRoomPos['getAdjacentPositions']();
    for (let i in adjPosList) {
        let auxPos = adjPosList[i];
        if (auxPos['isWalkable']())
            iniMem.task.push([auxPos.x, auxPos.y, 0]);

    }
    const containerReference = Memory['colony'][roomName]['roomPlanning']['containerReference']["container_" + stationName];
    const containerPos: [number, number] = Memory['colony'][roomName]['roomPlanning']['model']['container'][containerReference]['pos'];
    // search in iniMem.task for containerPos and make it the first element
    for (let i = 0; i < iniMem.task.length; ++i) {
        if (iniMem.task[i][0] == containerPos[0] && iniMem.task[i][1] == containerPos[1]) {
            let aux = iniMem.task[0];
            iniMem.task[0] = iniMem.task[i];
            iniMem.task[i] = aux;
            break;
        }
    }

    Memory['colony'][roomName]['dpt_harvest'][stationName] = iniMem;

}

export function iniDptHarvest(roomName: string) {
    Memory['colony'][roomName]['dpt_harvest'] = {};
    iniStationHarvest(roomName, 'source1');
    iniStationHarvest(roomName, 'source2');
    //iniStationHarvest(roomName, 'mineral');
    //iniStationHarvest(roomName, 'highway');

}