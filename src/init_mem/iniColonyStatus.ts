import {ColonyStatus} from "@/colony/colonyStatus";

export function iniColonyStatus(roomName: string) {
    Memory['colony'][roomName]['colonyStatus'] = {};
    const colonyStatus = new ColonyStatus(roomName);
    colonyStatus.initializeAndSave();
}