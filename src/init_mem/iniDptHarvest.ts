import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";

export function iniDptHarvest(roomName: string) {
    Memory['colony'][roomName]['dpt_harvest'] = {};
    Memory['colony'][roomName]['dpt_harvest']['workStation'] = {};
    Memory['colony'][roomName]['dpt_harvest']['target'] = {};
    Memory['colony'][roomName]['dpt_harvest']['creepsDeadTick'] = {};
    //Memory['colony'][roomName]['dpt_harvest']['substitutionList'] = {};
    iniWorkStation(roomName);
}

export function randomHarvesterWorkPositionName(): string {
    return 'HV' + Math.floor(Math.random() * 100000);
}

export function iniTargets(roomName: string) {
    let targets: HarvesterTargets = {
        containerSource1: null,
        containerSource2: null,
        containerMineral: null,
        linkSource1: null,
        linkSource2: null
    };
    Memory['colony'][roomName]['dpt_harvest']['target'] = targets;
}



export function iniWorkStation(roomName: string) {


}
