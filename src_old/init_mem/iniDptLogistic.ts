import {LogisticWorkStation} from "@/workStation/logisticWorkStation";

export function iniDptLogistic(roomName: string) {
    Memory['colony'][roomName]['dpt_logistic'] = {};
    iniInternalLogisticStation(roomName);
}

export function iniInternalLogisticStation(roomName: string) {
    let logisticStation = new LogisticWorkStation(roomName, 'internal');
    logisticStation.initializeAndSave();
}