import {iniRoomPlanning} from "@/init_mem/iniRoomPlanning";
import {iniDptHarvest} from "@/init_mem/iniDptHarvest";
import {iniCreepSpawning} from "@/init_mem/iniCreepSpawning";
import {OrderManager} from "@/orderManager";
import {iniDptLogistic, iniLogistic} from "@/init_mem/iniDptLogistic";
import {iniDptBuilder} from "@/init_mem/iniDptBuilder";


export function iniColony(roomName: string) {
    if (!Memory['colony']) Memory['colony'] = {};
    if (!Memory['colony'][roomName]) Memory['colony'][roomName] = {};

    iniRoomPlanning(roomName);
    iniCreepSpawning(roomName);
    iniDptHarvest(roomName);
    iniLogistic(roomName);
    iniDptBuilder(roomName);

    const orderManager = new OrderManager(roomName);
    orderManager.sendIniOrder();

    if (!Memory['creeps']) Memory['creeps'] = {};
}