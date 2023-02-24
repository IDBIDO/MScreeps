/***************************************************
 *                   COLONY MEMORY                   *
 ***************************************************/
interface ColonyMemory {
    //colonyState: {}
    roomPlanning: RoomPlanningMemory
    creepSpawning: CreepSpawnMemory
    dpt_harvest: {[id: string]: HarvestStationMemory}
    //dpt_logistic: {}
    //dpt_build: {}
    //dpt_upgrade: {}
    //dpt_repair: {}
    //labSet: {}
    //towerSet: {}


}

interface ColonyStatusMemory {
    buildRCL: number;
    fase: number;
    operationResearchState: boolean;
    storageID: string;
}

interface RoomPlanningMemory {
    model: {[structureName: string]: {id: string, pos: [number, number]}[]}
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

//structure types
type modelType = 'spawn' |  'link' | 'tower' | 'storage' | 'terminal' | 'lab' |
    'observer' |  'nuker' | 'source' | 'mineral' | 'container' | 'road' | 'rampart' | 'constructedWall' |
    'controller' | 'powerBank' | 'extractor' | 'factory' |
    'powerSpawn' | 'extension';

type DepartmentName = 'dpt_harvest'| 'dpt_logistic'| 'dpt_build'| 'dpt_upgrade'| 'dpt_repair'

/***************************************************
 *                   CREEP SPAWN                   *
 ***************************************************/
interface CreepSpawnMemory {
    spawnId: string[];
    spawnTask: {
        0: SpawnTaskSet;
        1: SpawnTaskSet;
        2: SpawnTaskSet;
    }
}

type SpawnTaskSet = {[creepName: string]: SpawnTask}
type SpawnTask = {    body: BodyMode; creepMemory: CreepMemory; }

type BodyMode = 'default' | 'big'

/***************************************************
 *                   CREEPS                        *
 ***************************************************/



interface CreepMemory {
    role: CreepRole;
    taskData: CreepTaskData;

    working:  boolean;
    ready:  boolean;
    dontPullMe: boolean;

    workStationID:  string;
    departmentName:  DepartmentName;
    roomName:  string;
}

// CREEP ROLE
type CreepRole = HarvesterRole | TransporterRole | BuilderRole
type HarvesterRole = 'harvester' | 'initializer'
type TransporterRole = 'transporter';
type BuilderRole = 'builder' | 'supporter'

// CREEP TASK DATA
type CreepTaskData = HarvesterTaskData | TransporterTaskLocation | BuilderTaskData//| TransporterTaskData

interface BuilderTaskData {
    constructionSiteInfo: ID_Room_position;

    transportTaskSent: boolean;
}
interface HarvesterTaskData {
    sourceInfo: ID_Room_position;   // source
    targetInfo: ID_Room_position;   // save
    workPosition: [number, number];
}

interface TransporterTaskData {
    stationId: string;
    stationDpt: DepartmentName;
    taskType: 'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL'
    amount:  number;
    resourceType:  ResourceConstant;
    transporterCreepName: string;
    taskObjectInfo?: ID_Room_position;

    //creepList?: string[];   // only for move task
}

interface TransporterTaskLocation {
    taskType: 'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL'
    stationId: string;
}


/************** CREEP WORK ********************/
type CreepWork = {
    [role in CreepRole]: (data: CreepTaskData) => ICreepConfig
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


    source: (creep: Creep) => boolean;
    // creep 工作时执行的方法,
    // 返回 true 则执行 source 阶段，返回其他将继续执行该方法
    target: (creep: Creep) => boolean;

    // 每个角色默认的身体组成部分
    //bodys: BodyPartConstant[];
}

interface transferTaskOperation {
    // creep 工作时执行的方法
    target: (creep: Creep) => boolean
    // creep 非工作(收集资源时)执行的方法
    source: (creep: Creep) => boolean
}


/***************************************************
 *                   STATION                       *
 ***************************************************/
type StationMemory = HarvestStationMemory

// CREEP CONFIG -> equal for all departments
interface  CreepSpawnConfig {
    //role:  string;
    body:  'default' | 'big';          // body mode: default, manual
    priority:  number;
    creepMemory:  CreepMemory
}

// STATION TYPE
type StationType = HarvesterStationType | BuilderStationType | UpgraderStationType | RepairerStationType | LogisticStationType;
type HarvesterStationType = 'source1' | 'source2' | 'mineral' | 'highway';
type BuilderStationType = 'interiorConstructor' | 'externalConstructor';
type UpgraderStationType = 'internal' | 'external';
type RepairerStationType = 'withLinkRepairer' | 'noLinkRepairer';
type LogisticStationType = 'internal' | 'external';

// CREEP LIST
type CreepDeadTick = {[creepName: string]: number }

/***************************************************
 *             HARVESTER STATION                   *
 ***************************************************/

/*
    To initialize: creepConfig, creepTask, needTransporterCreep, transporterSetting


 */

interface HarvestStationMemory {
    creepDeadTick: CreepDeadTick;
    creepConfig:  CreepSpawnConfig;

    resourceType: ResourceConstant;
    order: HarvesterWorkStationOrder [];
    taskData: {
        sourceInfo: ID_Room_position;
        targetInfo: ID_Room_position
        workPosition: [number, number, number][];  // workPosition[0] = x, workPosition[1] = y, workPosition[2]: 0|1 = ocupied?
    }


    //distanceToSpawn:  number;
    needTransporterCreep:  boolean;
    transporterSetting:  TransporterTaskData;
}

// ORDER
type HarvesterWorkStationOrderType = 'DELETE_CREEP' | 'ADD_CREEP' | 'SET_TRANSPORTER_CREEP' | 'UNSET_TRANSPORTER_CREEP'| 'MODIFY_TARGET'
type HarvesterWorkStationOrder = {name: HarvesterWorkStationOrderType, data: {}}


/***************************************************
 *             LOGISTIC STATION                   *
 ***************************************************/

type LogisticWorkStationOrderType = 'ADD_CREEP' | 'DELETE_CREEP' | 'ADD_TASK' | 'DELETE_TASK';
type LogisticWorkStationOrder = {name: LogisticWorkStationOrderType, data: {}}

type LogisticTaskType = 'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL';
interface LogisticStationMemory {
    creepDeadTick: CreepDeadTick;
    creepConfig:  CreepSpawnConfig;

    order: LogisticWorkStationOrder [];
    fillTask:number;
    taskList:{
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
    availableCreepList: string[];
    toRemoveCreepList: CreepDeadTick


}

/***************************************************
 *             WITHDRAW TASK CONTROLLER            *
 ***************************************************/


/***************************************************
 *             BUILDER STATION                   *
 ***************************************************/
interface AddConstructionSideData {
    //id: string;
    type: string;
    index: number;
    pos: [number, number];
    roomName: string;
    added: boolean;

}

interface CheckConstructionSideData {
    id: string;
    type: string;
    index: number;
}



type BuilderWorkStationOrderType = 'ADD_CREEP' | 'DELETE_CREEP' | 'ADD_CONSTRUCTION_SITE' | 'DELETE_CONSTRUCTION_SITE'
type BuilderWorkStationOrder = {name: BuilderWorkStationOrderType, data: {}}
/*
   ADD_CONSTRUCTION_SIDE:
        type: string;
        index: number;
        pos: [number, number];
        roomName: string;
        added: boolean;
 */

interface BuilderStationMemory {
    creepDeadTick: CreepDeadTick;
    creepConfig:  CreepSpawnConfig;
    order: BuilderWorkStationOrder [];
    addConstructionSiteList: AddConstructionSideData[];
    checkConstructionSideList: CheckConstructionSideData[];
    toRemoveCreepList: CreepDeadTick;
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
