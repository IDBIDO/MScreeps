

/*

interface LogisticStationMemory extends StationMemory {
    order: {name: CreepControlOrder, data: {}}[];
    storageId: string;

    fillTask: string;
    task: {
        MOVE: {
            [id: string]: TransporterTaskData
        },
        TRANSFER: {
            [id: string]: TransporterTaskData
        },
        WITHDRAW: {
            [id: string]: TransporterTaskData
        },
    }
}


interface TransporterTaskData {
    stationId: string;
    stationDpt: DepartmentName;
    taskType: 'MOVE' | 'TRANSFER' | 'WITHDRAW' | 'FILL'
    amount:  number;
    resourceType:  ResourceConstant;
    taskObjectInfo?: ID_Room_position;
    creepName: string;
    //creepList?: string[];   // only for move task
}


 */

import {LogisticStationMem} from "@/access_memory/logisticStationMem";

export function iniDptLogistic(roomName: string, stationName: string) {
    if (!Memory['colony'][roomName]['dpt_logistic']) Memory['colony'][roomName]['dpt_logistic'] = {};
    if (!Memory['colony'][roomName]['dpt_logistic'][stationName]) Memory['colony'][roomName]['dpt_logistic'][stationName] = {};


    let iniMem: LogisticStationMemory = {
        creepConfig: {
            body: {
                carry: 3,
                move: 3,
            },
            priority: 0,
            creepMemory: {
                role: "transporter",

                working: false,
                ready: false,
                ending: false,
                dontPullMe: false,

                workStationID: stationName,
                departmentName: "dpt_logistic",
                roomName: roomName,
                task: {
                    id: null,
                    type: null,
                    status: "Idle",
                    //creepName: null,
                }
            },


        },
        creepDeadTick: {},
        fillTask: null,
        order: [],
        storageId: null,
        task: {MOVE: {}, TRANSFER: {}, WITHDRAW: {}}

    }

    Memory['colony'][roomName]['dpt_logistic'][stationName] = iniMem;
}

export function iniLogistic(roomName: string) {
    iniDptLogistic(roomName, "internal_transport");

}



