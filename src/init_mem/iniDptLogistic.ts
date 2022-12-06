import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";
import {LogisticWorkStation} from "@/workStation/logisticWorkStation";

export function iniDptLogistic(roomName: string) {
    Memory['colony'][roomName]['dpt_logistic'] = {};
    iniWorkStationInterior(roomName);
    iniWorkStationExterior(roomName);

}


export function iniWorkStationInterior(roomName: string) {
    let logisticStation = new LogisticWorkStation(roomName);
    logisticStation.initializeLogisticWorkStationAndSave('interiorTransporter');

}

export function iniWorkStationExterior(roomName: string) {
    let logisticStation = new LogisticWorkStation(roomName);
    logisticStation.initializeLogisticWorkStationAndSave('externalTransporter');

}