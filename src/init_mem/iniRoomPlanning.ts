import * as utils from "@/init_mem/computePlanning/planningUtils"
import * as computePlanning from "@/init_mem/computePlanning/computePlanning"
import {reconstructPath} from "@/init_mem/computePlanning/planningUtils";

/* initialize colony planning mem block */
export function iniRoomPlanning(roomName: string): void {
    if (!Memory['colony'][roomName]) {
        Memory['colony'][roomName] = {};
    }

    Memory['colony'][roomName]['roomPlanning'] = {};
    let roomStructsData = computePlanning.getPlanningData(roomName);

    generateModel(roomStructsData, roomName); //model data

    generateTemp(roomName); //temp data
    generateInRampartPos(roomStructsData, roomName); //in rampart pos

    generateContainerReference(roomStructsData['container'], roomName);   //container reference
    generateLinkReference(roomStructsData['link'], roomName);             //link reference

    generateRoadReference(roomStructsData['road'], roomName);   //road reference
}

export function generateModel(model: {}, roomName: string): void {
    Memory['colony'][roomName]['roomPlanning']['model'] = {}
    for (let structureName in model) {
        Memory['colony'][roomName]['roomPlanning']['model'][structureName] = []
        for (let i in model[structureName])
            Memory['colony'][roomName]['roomPlanning']['model'][structureName].push(
                {'id': '', 'pos': model[structureName][i]}
            )
    }

    const saPos: [number, number] = [Game.flags.pa.pos.x, Game.flags.pa.pos.y];
    const sbPos: [number, number] = [Game.flags.pb.pos.x, Game.flags.pb.pos.y];
    const mPos: [number, number] = [Game.flags.pm.pos.x, Game.flags.pm.pos.y];
    Memory['colony'][roomName]['roomPlanning']['model']['source'] = [];
    Memory['colony'][roomName]['roomPlanning']['model']['source'].push(
        {'id': utils.getId(roomName, saPos, 'source'), 'pos': saPos}
    )
    Memory['colony'][roomName]['roomPlanning']['model']['source'].push(
        {'id': utils.getId(roomName, sbPos, 'source'), 'pos': sbPos}
    )
    Memory['colony'][roomName]['roomPlanning']['model']['source'].push(
        {'id': utils.getId(roomName, mPos, 'mineral'), 'pos': mPos}
    )
}

export function generateTemp(roomName: string): void {
    computePlanning.generateTemporal(roomName);
}

export function generateInRampartPos(roomStructsData, roomName: string): void {
    Memory['colony'][roomName]['roomPlanning']['inRampartPos'] = computePlanning.getInRampartPos(roomStructsData, roomName);
}

export function generateContainerReference(containerList:[], roomName: string): void {
    computePlanning.getContainerReference(containerList, roomName);
}

export function  generateLinkReference(linkList:[], roomName: string): void {
    computePlanning.getLinkReference(linkList, roomName);
}

export function generateRoadReference(roadList:[], roomName: string): void {
    computePlanning.getRoadReference(roadList, roomName);
}