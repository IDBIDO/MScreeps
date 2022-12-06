


interface modelData {
        id: string;
        pos: [number, number];
}

interface modelDataRoom {
        id: string;
        pos: [number, number];
        roomName: string;
}


/******************************* CREEP CONFIG *******************************/

interface CreepTask {

        taskID?: string;
        taskType?: string;
        sourceInfo: ID_Room_position;
        targetInfo: ID_Room_position;
        workPosition: {
                pos: [number, number];
                roomName: string;
        }
}

interface creepMemory {
        working: boolean;
        ready: boolean;
        role: string;
        creepTask: CreepTask;
        creepIndex?: number;
        workStationID: string;
        departmentName: departmentName;
        roomName: string;
        dontPullMe: boolean;
}

type CreepWork = {
        [role in CreepRoleConstant]: (data: {}) => ICreepConfig
}

// 所有的 creep 角色
type CreepRoleConstant = HarvesterRoleConstant | TransporterRoleConstant //| WorkerRoleConstant

type HarvesterRoleConstant =
        'harvester' |
        'initializer'

type TransporterRoleConstant =
        'transporter';

type WorkerRoleConstant =
        'builder' |
        'upgrader' |
        'repairer'


interface ID_Room_position {
        id: string;
        roomName: string;
        pos: [number, number];
}

interface HarvesterCreepData {
        sourceInfo: ID_Room_position;
        targetInfo: ID_Room_position;
        workPosition: [number, number];
}

type BaseRoleConstant =
    'harvester' |
    //'colonizer' |
    //'collector' |
    //'miner' |
    'upgrader_base' |
    //'filler' |
    'builder' |
    'repairer' |
    'initializer'|
    'iniQueen'|
    'storageFiller'

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

        source?: (creep: Creep) => boolean;
        // creep 工作时执行的方法,
        // 返回 true 则执行 source 阶段，返回其他将继续执行该方法
        target: (creep: Creep) => boolean;

        // 每个角色默认的身体组成部分
        //bodys: BodyPartConstant[];
}



interface SpawnTask {
        creepName: string;
        //creepBodyOption: string;
        departmentName: departmentName;
        workStationId: string;
        creepIndex: number;
        creepTask: CreepTask;
}

/******************************** DEPARTMENT ***************************************/


interface transferTaskOperation {
        // creep 工作时执行的方法
        target: (creep: Creep) => boolean
        // creep 非工作(收集资源时)执行的方法
        source: (creep: Creep) => boolean
}

type LogisticTaskType =
    'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL'

// logistics department
interface logisticTask {
        taskID: string;
        type: LogisticTaskType
        //sourceInfo: ID_Room_position;
        targetInfo: ID_Room_position;

        operationCreepName: string;
}

type LogisticOrder =  'removeCreep' | 'addCreep';

interface LogisticWorkStationData {

        //type: stationType;
        order: LogisticOrder[]

        creepList: creepState[];

        sourceInfo: HarvesterSourceInfo;
        targetInfo: HarvesterTargetInfo

        creepConfig:  CreepSpawnConfig;

        //distanceToSpawn:  number;
        //needTransporterCreep:  boolean;
        //transporterSetting?:  TransporterSetting;
        taskList: {
                temporalTask: {};
                permanentTask: {};
        }
        availableCreep: string[]
}

type WorkStationOrder = 'ADD_CREEP'| 'DELETE_CREEP'| 'SET_TRANSPORTER_CREEP' | 'UNSET_TRANSPORTER_CREEP';

type StationOrder = 'addCreep' | 'removeCreep' | 'addTransporterCreep' | 'removeTransporterCreep';

type HarvesterStationType = 'source1' | 'source2' | 'mineral' | 'highway' | null;
type BuilderStationType = 'interiorConstructor' | 'externalConstructor' | null;
type UpgraderStationType = 'interiorUpgrader' | 'externalUpgrader' |null;
type RepairerStationType = 'withLinkRepairer' | 'noLinkRepairer' | null;
type LogisticStationType = 'interiorTransporter' | 'externalTransporter' | null;

type StationType = HarvesterStationType | BuilderStationType | UpgraderStationType | RepairerStationType | LogisticStationType;

interface creepState {
    creepName: string;
    deadTick: number;
    substituteCreepName?: string;
    substituteDeadTick?: number;
    workPosition: [number, number];
    workRoomName: string;
    transporterCreepName: string;
    transporterDeadTick: number;
}

type HarvesterWorkStation = 'initializer' | 'harvester';

interface HarvesterWorkStationData {

        //type: stationType;
        order: HarvesterWorkStationOrder[];

        workPosition: [number, number, number][];  // workPosition[0] = x, workPosition[1] = y, workPosition[2]: 0|1 = ocupied?
        creepList: creepState[];

        sourceInfo: HarvesterSourceInfo;
        targetInfo: HarvesterTargetInfo

        creepConfig:  CreepSpawnConfig;

        distanceToSpawn:  number;
        needTransporterCreep:  boolean;
        transporterSetting?:  TransporterSetting;
}

type HarvesterWorkStationOrder = 'DELETE_CREEP' | 'ADD_CREEP' | 'SET_TRANSPORTER_CREEP' | 'UNSET_TRANSPORTER_CREEP';

//type LogisticWorkStationOrder = 'ADD_CREEP' | 'REMOVE_CREEP'

interface TransporterSetting {
        stationId: string;
        needWithdraw:  boolean;
        amount:  number;
        resourceType:  ResourceConstant;
}

interface HarvesterSourceInfo {
        sourceId:  string;
        roomName:  string ;
        pos:  [ number ,  number ];
}

interface HarvesterTargetInfo {
        targetId: string;
        roomName: string;
        pos: [number, number];

}


type creepDeadState = [key: string, value: boolean];

interface HarvesterTargets {
        //source1:  Source;
        //source2:  Source;
        //mineral:  Mineral;
        containerSource1:  StructureContainer;
        containerSource2:  StructureContainer;
        containerMineral:  StructureContainer;
        linkSource1:  StructureLink;
        linkSource2:  StructureLink;
}

interface  CreepSpawnConfig {
        //role:  string;
        body:  'default' | 'big';          // body mode: default, manual
        priority:  number;
        memory:  BasicMemory | ManagerMemory;
}

interface BasicMemory {
        working:  boolean;
        ready:  boolean;
        role: CreepRoleConstant;
        workStationID:  string;
        departmentName:  departmentName;
        roomName:  string;
        dontPullMe: boolean;
}

interface ManagerMemory {
        departmentName:  departmentName;
}

interface UpgraderMemory {
        sourceId: string;
        containerId?: string;
        linkId?: string;
}

/***********************************************************************/


interface Point{
    x: number;
    y: number;
}

interface arrayPos {
        ref: string,
        pos: [number, number]
        distance: number
}

type departmentName =
    'dpt_harvest'|
    'dpt_logistic'|
    'dpt_build'|
    'dpt_upgrade'|
    'dpt_repair'

type memConstant =
    departmentName |
    'roomPlanning' |
    'creepSpawning' |
    'tower'

