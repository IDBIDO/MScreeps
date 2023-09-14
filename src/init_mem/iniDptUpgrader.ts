import {RoomPlanningMem} from "@/access_memory/roomPlanningMem";
import * as utils from "@/init_mem/computePlanning/planningUtils";
import {getMovementPath} from "@/utils";



export function getContainerPos(roomName: string): [number, number] {
    const containerReference = Memory['colony'][roomName]['roomPlanning']['containerReference']["container_controller"];
    return Memory['colony'][roomName]['roomPlanning']['model']['container'][containerReference]['pos'];
}
export function iniStationUpgrader(roomName: string, stationName: string) {
    if (!Memory['colony'][roomName]['dpt_upgrade']) Memory['colony'][roomName]['dpt_upgrade'] = {};
    if (!Memory['colony'][roomName]['dpt_upgrade'][stationName]) Memory['colony'][roomName]['dpt_upgrade'][stationName] = {};


    let iniMem: UpgradeStationMemory = {

        creepConfig: {
            body: {
                work: 2,
                carry: 1,
                move: 1,
            },
            priority: 2,
            creepMemory: {
                role: "upgrader",

                working: false,
                ready: false,
                ending: false,
                dontPullMe: true,

                workStationID: stationName,
                departmentName: "dpt_upgrade",
                roomName: roomName,

            }
        },
        creepDeadTick: {},
        currentRCL: 1,
        levelUp: false,
        containerWorkPos: [],
        containerPath: [],
        containerPathEntrance: 0,

        linkPath: [],
        linkWorkPos: [],
        linkPathEntrance: 0,
        order: [],
        sourceInfo: {id: null, pos: null, roomName: roomName, type: null},
    }

    // containerWorkPos
    const aux = getContainerPos(roomName);
    const upgraderContainerPos = new RoomPosition(aux[0], aux[1], roomName);
    const adjPosList = upgraderContainerPos['getAdjacentPositions']();
    iniMem.containerWorkPos.push([aux[0], aux[1]]);
    for (let i in adjPosList) {
        let auxPos = adjPosList[i];
        if (auxPos['isWalkable']())
            iniMem.containerWorkPos.push([auxPos.x, auxPos.y]);
    }

    iniMem.containerPath = getMovementPath(iniMem.containerWorkPos);

    // linkWorkPos
    const auxLink = Memory['colony'][roomName]['roomPlanning']['linkReference']['link_controller'];
    const linkPos = Memory['colony'][roomName]['roomPlanning']['model']['link'][auxLink]['pos'];
    const linkRoomPos = new RoomPosition(linkPos[0], linkPos[1], roomName);
    const linkAdjPosList = linkRoomPos['getAdjacentPositions']();
    for (let i in linkAdjPosList) {
        let auxPos = linkAdjPosList[i];
        if (auxPos['isWalkable']())
            iniMem.linkWorkPos.push([auxPos.x, auxPos.y]);
    }

    // linkWorkPosEntrance
    const roomPlanningMem = new RoomPlanningMem(roomName);
    const spawnToControllerPath = roomPlanningMem.getRoadPathReferenceList("spawn0ToController");
    const nearestPos = roomPlanningMem.getPositionFromReference("road", spawnToControllerPath[spawnToControllerPath.length - 1]);
    // linkWorkPosEntrance is the index of the nearestPos in linkWorkPos

    for (let i = 0; i < iniMem.linkWorkPos.length; ++i) {
        if (iniMem.linkWorkPos[i][0] == nearestPos[0] && iniMem.linkWorkPos[i][1] == nearestPos[1]) {
            iniMem.linkPathEntrance = i;
            break;
        }
    }

    // find index of entrancePos in containerWorkPos
    for (let i = 0; i < iniMem.containerWorkPos.length; ++i) {
        if (iniMem.containerWorkPos[i][0] == nearestPos[0] && iniMem.containerWorkPos[i][1] == nearestPos[1]) {
            iniMem.containerPathEntrance = i;
            break;
        }
    }


    // linkPath
    iniMem.linkPath = getMovementPath(iniMem.linkWorkPos);


    Memory['colony'][roomName]['dpt_upgrade'][stationName] = iniMem;

}

export function iniDptUpgrade(roomName: string) {
    Memory['colony'][roomName]['dpt_upgrade'] = {};
    iniStationUpgrader(roomName, 'internal_upgrade');
}