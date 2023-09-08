
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

type DepartmentName = 'dpt_harvest'| 'dpt_logistic'| 'dpt_build'| 'dpt_upgrade'| 'dpt_repair'| 'creepSpawning' | 'dpt_miner';


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

    task?: {
        id: string;
        type: 'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL';
        status: 'InProcess' | 'Done' | 'Idle';

    } | any;
}
type CreepRole = HarvesterRole | TransporterRole | BuilderRole //| UpgraderRole;
    //"harvester" | "miner" |"transporter" | "builder" | "upgrader" | "repairer"

type HarvesterRole = 'harvester' | 'miner';

type TransporterRole = 'transporter';

type BuilderRole = 'builder' | 'repairer';

type UpgraderRole = 'upgrader';

/***************************************************
 *                 CREEP BEHAVIOUR                *
 ***************************************************/

type CreepWork = {
    [role in CreepRole]: () => ICreepConfig
}


interface ICreepConfig {
    /*
    // 每次死后都会进行判断，只有返回 true 时才会重新发布孵化任务
    isNeed?: (room: Room, creepName: string, preMemory: CreepMemory) => boolean;
    // 准备阶段执行的方法, 返回 true 时代表准备完成
    prepare?: (creep: Creep) => boolean;
    // creep 获取工作所需资源时执行的方法
    // 返回 true 则执行 target 阶段，返回其他将继续执行该方法
    */
    prepare?: (creep: Creep) => boolean

    boost?: (creep: Creep) => boolean;


    source: (creep: Creep) => boolean;
    // creep 工作时执行的方法,
    // 返回 true 则执行 source 阶段，返回其他将继续执行该方法
    target: (creep: Creep) => boolean;

    // 每个角色默认的身体组成部分
    //bodys: BodyPartConstant[];
}


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

type StationType = HarvestStationType | LogisticStationType | BuildStationType;

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
 *                 BUILD STATION                 *
 ***************************************************/
interface BuildStationMemory extends StationMemory {
    order: {name: BuildStationOrder, data: {}}[];
    buildTask: {
        0: BuildTaskData[],     // for storage structure (storage, container, link, terminal, extractor)
        1: BuildTaskData[],     // Roads
        2: BuildTaskData[],     // tower
        3: BuildTaskData[],     // spawn and extension
        4: BuildTaskData[],     // other structure
    }
}

interface BuildTaskData {
    id: string;
    department: DepartmentName;
    stationType: StationType;
    pos: [number, number];
    roomName: string;
    structureType: BuildableStructureConstant;
    index: number;

}

type BuildStationType = 'internal_build';

type BuildStationOrder = CreepControlOrder | 'ADD_BUILD_TASK';

/***************************************************
 *                 LOGISTIC STATION                *
 ***************************************************/
interface LogisticStationMemory extends StationMemory {
    order: {name: CreepControlOrder, data: {}}[];
    storageId: string;

    fillTask: string;
    task: {
        MOVE: {
            [id: string]: TransporterTaskData
        },
        TRANSFER: {
            [id: string]: TransporterTaskData
        },
        WITHDRAW: {
            [id: string]: TransporterTaskData
        },
    }
}

type LogisticStationType = 'internal_transport';


interface TransporterTaskData {
    stationId: string;
    stationDpt: DepartmentName;
    taskType: 'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL'
    amount:  number;
    resourceType:  ResourceConstant;
    taskObjectInfo?: ID_Room_position;
    creepName: string;
    creepList?: string[];   // only for move task
}

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


