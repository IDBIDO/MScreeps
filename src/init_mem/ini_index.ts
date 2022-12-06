import {iniRoomPlanning} from "@/init_mem/iniRoomPlanning";
import {iniDptHarvest} from "@/init_mem/iniDptHarvest";
import {iniCreepSpawning} from "@/init_mem/iniCreepSpawning";
import {iniDptLogistic} from "@/init_mem/iniDptLogistic";

export function iniColony(roomName: string) {
    iniRoomPlanning(roomName);
    iniDptHarvest(roomName);
    iniDptLogistic(roomName);
    iniCreepSpawning(roomName);
}