import {iniRoomPlanning} from "@/init_mem/iniRoomPlanning";
import {iniDptHarvest} from "@/init_mem/iniDptHarvest";
import {iniCreepSpawning} from "@/init_mem/iniCreepSpawning";
import {iniDptLogistic} from "@/init_mem/iniDptLogistic";
import {iniColonyStatus} from "@/init_mem/iniColonyStatus";
import {iniDptBuild} from "@/init_mem/iniDptBuild";

export function iniColony(roomName: string) {
    if (!Memory['colony']) Memory['colony'] = {};


    iniColonyStatus(roomName);
    iniRoomPlanning(roomName);
    iniCreepSpawning(roomName);
    iniDptHarvest(roomName);
    iniDptLogistic(roomName);
    iniDptBuild(roomName);
}