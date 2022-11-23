import {iniRoomPlanning} from "@/init_mem/iniRoomPlanning";
import {iniDptHarvest} from "@/init_mem/iniDptHarvest";
import {iniCreepSpawning} from "@/init_mem/iniCreepSpawning";

export function iniColony(roomName: string) {
    iniRoomPlanning(roomName);
    iniDptHarvest(roomName);
    iniCreepSpawning(roomName);
}