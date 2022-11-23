


interface modelData {
        id: string;
        pos: [number, number];
}

interface creepDeadData {
        [creepName: string]: number;

}

interface SpawnTask {
        creepName: string;
        creepBodyOption: string;
        departmentName: string;
        workStationId: string;
}

/******************************** DEPARTMENT ***************************************/

type WorkStationOrder = 'ADD_CREEP' | 'DELETE_CREEP';

type StationOrder = 'addCreep' | 'removeCreep' | 'addTransporterCreep' | 'removeTransporterCreep';
type HarvesterStationOrder = 'changeTargetInfo' | 'changeCreepConfig' ;


type stationType= 'source1' | 'source2' | 'mineral' | 'highway' | null;

interface creepState {
    creepName: string;
    deadTick: number;
    substitute: string;
    substituteDeadTick: number;
}

type HarvesterWorkStation = 'initializer' | 'harvester';

interface HarvesterWorkStationData {

        type: stationType;
        orders: HarvesterWorkStationOrder[];

        workPositions: [number, number, number][];  // workPosition[0] = x, workPosition[1] = y, workPosition[2]: 0|1 = ocupied?
        creepList: creepState[];

        sourceInfo: HarvesterSourceInfo;
        targetInfo: HarvesterTargetInfo

        creepConfig:  CreepSpawnConfig;

        distanceToSpawn:  number;
        needTransporterCreep:  boolean;
        transporterSetting?:  TransporterSetting;
}

type HarvesterWorkStationOrder = 'removeCreep' | 'addCreep' | 'addTransporter' | 'removeTransporter';

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

type harvesterRole =
        'iniHarvester'  |
        'harvester';

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
        body:  'default' | 'manual';          // body mode: default, manual
        priority:  number;
        memory:  BasicMemory | ManagerMemory;
}

interface BasicMemory {
        working:  boolean;
        ready:  boolean;
        role: string;
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

