import {ColonyStatus} from "@/colony/colonyStatus";

export function iniColonyStatus(roomName: string) {
    if (!Memory['colony'][roomName]) Memory['colony'][roomName] = {}
    Memory['colony'][roomName]['colonyStatus'] = {};
    const colonyStatus = new ColonyStatus(roomName);
    colonyStatus.initializeAndSave();
}