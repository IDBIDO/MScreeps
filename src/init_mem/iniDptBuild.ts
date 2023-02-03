import {BuilderWorkStation} from "@/workStation/builderWorkStation";

export function iniDptBuild(roomName: string) {

    Memory['colony'][roomName]['dpt_build'] = {};
    iniInternal(roomName);
}

export function iniInternal(roomName: string) {
    const buildStation = new BuilderWorkStation(roomName, 'internal');
    buildStation.initializeAndSave();
}

export function iniExternal(roomName: string) {
    const buildStation = new BuilderWorkStation(roomName, 'external');
    buildStation.initializeAndSave();
}