import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";

export function iniDptHarvest(roomName: string) {
    Memory['colony'][roomName]['dpt_harvest'] = {};
    iniWorkStationSource1(roomName);
    iniWorkStationSource2(roomName);
    iniMineralStation(roomName);
}


export function iniWorkStationSource1(roomName: string) {
    let harvesterStation = new HarvesterWorkStation(roomName, 'source1');
    harvesterStation.initializeAndSave();
}

export function iniWorkStationSource2(roomName: string) {
    let harvesterStation = new HarvesterWorkStation(roomName, 'source2');
    harvesterStation.initializeAndSave();
}

export function iniMineralStation(roomName: string) {
    let harvesterStation = new HarvesterWorkStation(roomName, 'mineral');
    harvesterStation.initializeAndSave();
}