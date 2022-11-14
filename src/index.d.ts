
interface modelData {
        id: string;
        pos: [number, number];
}

/******** Department *******/

type HarvesterWorkStation = 'initializer' | 'harvester';

interface WorkStationData {
        state: WorkPositionState;

        location: location;
        creepConfig:  CreepSpawnConfig;

        distanceToSpawn:  number;
        //canRenewCreep:  boolean;
        needTransporterCreep:  boolean;
        transporterSetting?:  TransporterSetting;
}

interface WorkPositionState {
    active: boolean;
    occupied: boolean;
    creepName: string;
    creepState: CreepState;
}

type CreepState =
        'working' |
        'renewing' |
        'dead';

interface TransporterSetting {
        id:  string;
        needWithdraw:  boolean;
        amount:  number;
        resourceType:  ResourceConstant;
}

interface location {
        roomName:  string ;
        pos:  [ number ,  number ];
}


type harvesterRole =
        'iniHarvester'  |
        'harvester';


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
        role:  string;
        body:  string[];
        priority:  number;
        memory:  HarvesterMemory|UpgraderMemory;
}

interface UpgraderMemory {
        sourceId: string;
        containerId?: string;
        linkId?: string;

}

interface  HarvesterMemory {
        sourceId: string;
        containerId?: string;
        linkId?: string;
}


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

