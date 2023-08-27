
interface ColonyMemory {
    roomPlanning: RoomPlanningMemory
    creepSpawning: CreepSpawnMemory
    //dpt_harvest: {[id: string]: HarvestStationMemory}
}

/***************************************************
 *                   ROOM PLANNING                   *
 ***************************************************/

interface RoomPlanningMemory {
    model: Model
    temp: {[structureName: string]: [number, number][]}
    inRampartPos: number[]
    containerReference: {
        container_source1: number,
        container_source2: number,
        container_mineral: number,
        container_controller: number,
    }
    linkReference: {
        link_source1: number,
        link_source2: number,
        link_controller: number,
        link_center: number,
    }
    roadReference: {
        spawn0ToSource1: number,
        spawn0ToSource2: number,
        spawn0ToController: number,
        spawn0ToMineral: number,
    }
}

type Model = {[structureName: string]: ModelData[]}
type ModelData = {id: string, pos: [number, number]}

type StructureType = 'spawn' |  'link' | 'tower' | 'storage' | 'terminal' | 'lab' |
    'observer' |  'nuker' | 'source' | 'mineral' | 'container' | 'road' | 'rampart' | 'constructedWall' |
    'controller' | 'powerBank' | 'extractor' | 'factory' |
    'powerSpawn' | 'extension';

type DepartmentName = 'dpt_harvest'| 'dpt_logistic'| 'dpt_build'| 'dpt_upgrade'| 'dpt_repair'| 'creepSpawning'


/***************************************************
 *                   CREEP SPAWN                   *
 ***************************************************/
interface CreepSpawnMemory {
    spawnId: string[];
    order: {name: GeneralOrder, data: {}}[];
    spawnTask: {
        0: SpawnTaskSet;
        1: SpawnTaskSet;
        2: SpawnTaskSet;
    }
}

type SpawnTaskSet = {[creepName: string]: SpawnTask}
type SpawnTask = {    body: bodyPart; creepMemory: CreepMemory; }

interface bodyPart {
    move?: number;
    work?: number;
    carry?: number;
    attack?: number;
    ranged_attack?: number;
    heal?: number;
    claim?: number;
    tough?: number;
}

/***************************************************
 *                     CREEP                        *
 ***************************************************/

interface CreepMemory {
    role: CreepRole;
    //taskData: CreepTaskData;

    working:  boolean;
    ready:  boolean;
    dontPullMe: boolean;

    workStationID:  string;
    departmentName:  DepartmentName;
    roomName:  string;
}
type CreepRole = "harvester" | "transporter" | "builder" | "upgrader" | "repairer"

/***************************************************
 *                      STATION                     *
 ***************************************************/

interface StationMemory {
    creepDeadTick: {[creepName: string]: number};
    creepConfig: CreepSpawnConfig;
    //order: OrderType[];

}


interface  CreepSpawnConfig {
    //role:  string;
    body:  bodyPart;          // body mode: default, manual
    priority:  number;
    creepMemory:  CreepMemory
}

type GeneralOrder = 'UPDATE_BUILDING_INFO' | 'SEARCH_BUILDING_TASK' | 'UPDATE_CREEP_NUM';

type CreepControlOrder = 'ADD_CREEP' | 'REMOVE_CREEP' | GeneralOrder;

type StationType = HarvestStationType;

/***************************************************
 *                 HARVEST STATION                 *
 ***************************************************/

interface HarvestStationMemory extends StationMemory {
    order: {name: HarvestStationOrder, data: {}}[];

    usage: {
        sourceInfo: ID_Room_position;
        targetInfo: ID_Room_position;
    }

    task: [number, number, number][];  // task[0] = x, task[1] = y, task[2]: 0|1 = occupied?
}

type HarvestStationOrder = CreepControlOrder;

type HarvestStationType = 'source1' | 'mineral' | 'source2' | 'highway';

/***************************************************
 *                 UTILS TYPE                      *
 ***************************************************/

interface ID_Room_position {
    id: string;
    roomName: string;
    pos: [number, number];
}

interface modelData {
    id: string;
    pos: [number, number];
}

interface Point {
    x: number;
    y: number;
}

interface arrayPos {
    ref: string,
    pos: [number, number]
    distance: number
}


