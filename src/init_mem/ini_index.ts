import {iniRoomPlanning} from "@/init_mem/iniRoomPlanning";
import {iniDptHarvest} from "@/init_mem/iniDptHarvest";
import {iniCreepSpawning} from "@/init_mem/iniCreepSpawning";
import {OrderManager} from "@/orderManager";


export function iniColony(roomName: string) {
    if (!Memory['colony']) Memory['colony'] = {};

    iniRoomPlanning(roomName);
    iniCreepSpawning(roomName);
    iniDptHarvest(roomName);

    const orderManager = new OrderManager(roomName);
    orderManager.sendIniOrder();

    if (!Memory['creeps']) Memory['creeps'] = {};
}