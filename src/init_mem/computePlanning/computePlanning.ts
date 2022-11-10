import * as planning from "@/init_mem/RoomPlanning"
import * as utils from "@/init_mem/computePlanning/planningUtils"
import {connectedComponents} from "@/utils";

/* Return data to generate Model Planning*/
export function getPlanningData(roomName) {
    let roomStructsData;

    let p =  Game.flags.p;
    let pc =  Game.flags.pc;
    let pm =  Game.flags.pm;
    let pa =  Game.flags.pa;
    let pb =  Game.flags.pb;

    const saPosition: [number, number] = [pa.pos.x, pa.pos.y];
    const sbPosition: [number, number] = [pb.pos.x, pb.pos.y];
    const cPosition: [number, number] = [pc.pos.x, pc.pos.y];
    const mPosition: [number, number] = [pm.pos.x, pm.pos.y];


    if (p) {
        roomStructsData = planning.ManagerPlanner.computeManor(roomName,[pc,pm,pa,pb])
        Game.flags.p.remove();
    }
    if (roomStructsData) {
        planning.HelperVisual.showRoomStructures(roomName, roomStructsData['structMap'])
        return roomStructsData['structMap'];
    }

    return null;
}

export function roomWalls(roomStructsData, roomName: string): boolean[][] {
    //const rampartList = roomStructsData['rampart'];
    const matrix = new Array(50).fill(true).map(() => new Array(50).fill(true));
    const terrain = new Room.Terrain(roomName);
    for (let i = 0; i < 50; ++i) {
        for (let j = 0; j < 50; ++j) {
            if (terrain.get(i, j) == TERRAIN_MASK_WALL || utils.isRampartPos(roomName,[i, j])) {
                matrix[i][j] = false;
            }
        }
    }
    return matrix;
}
export function nearConectedPos(pos: [number, number], roomName: string): [number, number][] {
    const terrain = new Room.Terrain(roomName);
    const rampartList = Memory['colony'][roomName]['roomPlanning']['temp']['rampart'];

    const candidatePos = utils.nearPosition(pos);

    let r: [number, number][] = [];
    for (let i = 0; i < candidatePos.length; ++i) {

        if (terrain.get(candidatePos[i][0], candidatePos[i][1]) != TERRAIN_MASK_WALL && !utils.isRampartPos(roomName, candidatePos[i])) {
            r.push([candidatePos[i][0], candidatePos[i][1]])
        }
    }

    return r;
}
export function roomWallToAdj(roomCanPass: boolean[][], roomName: string): number[][] {
    let adjList: number[][]= [];
    for (let i = 0; i < roomCanPass.length; ++i) {
        for (let j = 0; j < roomCanPass[i].length; ++j) {
            const node = utils.translatePosToNode([i, j]);
            //console.log(node);

            if (!roomCanPass[i][j]) {
                adjList[node]=[];
            }
            else {
                const nearPos = nearConectedPos([i, j], roomName);
                let actualNode: number[] = [];
                for (let i = 0; i < nearPos.length; ++i) {
                    actualNode.push( utils.translatePosToNode(nearPos[i]) )
                }
                adjList[node] = actualNode;

            }
        }
    }



    /*
     for (let i = 0; i < roomCanPass.length; ++i) {
         for (let j = 0; j < roomCanPass[i].length; ++j) {
             const node = .translatePosToNode([j, i]);
             //console.log(node);
             if (!roomCanPass[i][j]) adjList.push([]);
             else {
                 const nearPos = .nearConectedPos([j, i]);
                 let actualNode: number[] = [];
                 for (let i = 0; i < nearPos.length; ++i) {
                     actualNode.push( .translatePosToNode(nearPos[i]) )
                 }
                 adjList.push(actualNode);
             }

         }
     }
     */
    return adjList;
}
export function searchCC(cc: number[][], obj: number) {
    for (let i = 0; i< cc.length; ++i) {

        for (let j = 0; j < cc[i].length; ++j) {
            if (cc[i][j] == obj) {
                return i;
            }
        }
    }
    return -1;
}
/* Return in rampart vector */
export function getInRampartPos(roomStructsData, roomName: string) {
    //const matrix = new Array(50).fill(false).map(() => new Array(50).fill(false));

    //wall pos mask false
    const roomWall = roomWalls(roomStructsData, roomName);
    let cont = 0;

    for (let i = 0; i < roomWall.length; ++i) {
        for (let j = 0; j < roomWall.length; ++j) {
            if (!roomWall[i][j]) ++cont;
        }
    }

    const adjacentList = roomWallToAdj(roomWall, roomName);
    const cc = connectedComponents(adjacentList)

    const spawn0Pos = Memory['colony'][roomName]['roomPlanning']['model']['spawn'][0]['pos'];
    const spawn0Node = utils.translatePosToNode(spawn0Pos);
    const indexProtectedComponent = searchCC(cc, spawn0Node);

    //console.log(cc[indexProtectedComponent]);
    let sortedCC = cc[indexProtectedComponent];
    sortedCC.sort();
    //console.log(sortedCC);

    let protectedPos: [number, number][] = [];
    for (let i = 0; i < sortedCC.length; ++i) {
        protectedPos.push(utils.translateNodeToPos(sortedCC[i]));
    }
    // console.log(protectedPos);
    //Memory['colony'][roomName]['roomPlanning']['inRampartPos'] =
    return sortedCC;
}

/* Classify containers */
export function getContainerReference(containerList: [], roomName: string) {

    let posSource1:[number, number] = Memory['colony'][roomName]['roomPlanning']['model']['source'][0]['pos'];
    let posSource2:[number, number] = Memory['colony'][roomName]['roomPlanning']['model']['source'][1]['pos'];
    let posMineral:[number, number] = Memory['colony'][roomName]['roomPlanning']['model']['source'][2]['pos'];

    let aux = Game.rooms[roomName].controller;
    let posController: [number, number] = [aux.pos.x, aux.pos.y];

    let containerSourcel = utils.minDistance(posSource1, containerList);
    let containerSource2 = utils.minDistance(posSource2, containerList);
    let containerMineral = utils.minDistance(posMineral, containerList);
    let containerController = utils.minDistance(posController, containerList);


    Memory['colony'][roomName]['roomPlanning']['containerReference'] = {
        'container_source1': containerSourcel,
        'container_source2': containerSource2,
        'container_mineral': containerMineral,
        'container_controller': containerController
    }
}

/* Classify links  */
export function getLinkReference(linkList: [], roomName: string) {
    const containerReference = Memory['colony'][roomName]['roomPlanning']['containerReference'];

    let posSourceContainer1: [number, number] = getPlanningStructurePos(roomName, 'container', containerReference['container_source1']);
    let posSourceContainer2: [number, number] = getPlanningStructurePos(roomName, 'container', containerReference['container_source2']);
    let posControllerContainer: [number, number] = getPlanningStructurePos(roomName, 'container', containerReference['container_controller']);
    let posCenterContainer: [number, number] = getPlanningStructurePos(roomName, 'container', containerReference['container_mineral']);

    let linkSourcel = utils.minDistance(posSourceContainer1, linkList);
    let linkSource2 = utils.minDistance(posSourceContainer2, linkList);
    let linkController = utils.minDistance(posControllerContainer, linkList);
    let linkCenter: number;
    for (let i = 0; i < linkList.length; ++i) {
        if (i != linkSourcel && i != linkSource2 && i != linkController) {
            linkCenter = i;
        }
    }

    Memory['colony'][roomName]['roomPlanning']['linkReference'] = {
        'link_source1': linkSourcel,
        'link_source2': linkSource2,
        'link_controller': linkController,
        'link_center': linkCenter
    }

}

/* Save in memory initial roads */
export function getRoadReference(roadList:[], mainRoom: string) {
    let roadListAdj =  utils.transformRoadToAdjacentList( roadList);
    const spawn0Pos: [number, number] = Memory['colony'][mainRoom]['roomPlanning']['model']['spawn'][0]['pos'];
    const posRoadNearSpawn0 = utils.nearPointOne(spawn0Pos, roadList);

    //Spawn0 to source1 path
    const containerSource1Reference: number = Memory['colony'][mainRoom]['roomPlanning']['containerReference']['container_source1']
    const containerSource1Pos: [number, number] = Memory['colony'][mainRoom]['roomPlanning']['model']['container'][containerSource1Reference]['pos'];
    const posRoadNearContainerSource1 = utils.nearPointOne(containerSource1Pos, roadList);
    let spawn0ToSource1 = utils.roadPath(roadListAdj, posRoadNearSpawn0, posRoadNearContainerSource1);

    //Spawn0 to source2 path
    const containerSource2Reference: number = Memory['colony'][mainRoom]['roomPlanning']['containerReference']['container_source2']
    const containerSource2Pos: [number, number] = Memory['colony'][mainRoom]['roomPlanning']['model']['container'][containerSource2Reference]['pos'];
    const posRoadNearContainerSource2 = utils.nearPointOne(containerSource2Pos, roadList);
    let spawn0ToSource2 = utils.roadPath(roadListAdj, posRoadNearSpawn0, posRoadNearContainerSource2);

    //Spawn0 to controller
    const containerControllerReference: number = Memory['colony'][mainRoom]['roomPlanning']['containerReference']['container_controller']
    const containerControllerPos: [number, number] = Memory['colony'][mainRoom]['roomPlanning']['model']['container'][containerControllerReference]['pos'];
    const posRoadNearContainerController = utils.nearPointOne(containerControllerPos, roadList);
    let spawn0ToController = utils.roadPath(roadListAdj, posRoadNearSpawn0, posRoadNearContainerController);


    //Spawn0 to mineral
    const containerMineralReference: number = Memory['colony'][mainRoom]['roomPlanning']['containerReference']['container_mineral']
    const containerMineralPos: [number, number] = Memory['colony'][mainRoom]['roomPlanning']['model']['container'][containerMineralReference]['pos'];
    const posRoadNearContainerMineral = utils.nearPointOne(containerMineralPos, roadList);
    let spawn0ToMineral = utils.roadPath(roadListAdj, posRoadNearSpawn0, posRoadNearContainerMineral);


    Memory['colony'][mainRoom]['roomPlanning']['roadReference'] = {
        'spawn0ToSource1': spawn0ToSource1,
        'spawn0ToSource2': spawn0ToSource2,
        'spawn0ToController': spawn0ToController,
        'spawn0ToMineral': spawn0ToMineral
    }

}


export function getPlanningStructurePos(roomName: string ,structureType: string, index: number) {
    const pos: [number, number] = Memory['colony'][roomName]['roomPlanning']['model'][structureType][index]['pos'];
    return pos;
}

export function getPlanningStructureId(roomName: string ,structureType: string, index: number) {
    const pos: [number, number] = Memory['colony'][roomName]['roomPlanning']['model'][structureType][index]['id'];
    if (pos) return pos;
    return null;
}

export function generateTemporal(roomName: string) {
    Memory['colony'][roomName]['roomPlanning']['temp'] = {};
    const temp = Memory['colony'][roomName]['roomPlanning']['temp'];
    const model = Memory['colony'][roomName]['roomPlanning']['model'];

    //copy model to temp
    for (let structureName in model) {
        Memory['colony'][roomName]['roomPlanning']['temp'][structureName] = {}
        for (let i in model[structureName])
            Memory['colony'][roomName]['roomPlanning']['temp'][structureName][i] =
                model[structureName][i]['pos']

    }

    //modify spawn order
    //this.tempSpawn();

    //modify extension order
    //this.tempExtension();



}