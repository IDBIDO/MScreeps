import * as api from "./api";
import mountExtensions from "./extensions/mountExtensions";
import MemHack from "./external_modules/MemHack"
import * as SuperMove from "./external_modules/SuperMove"
import {HarvestStation} from "@/stations/harvestStation";
import {CreepSpawning} from "@/creep/creepSpawing";
import {bodyProportion, bodyPrototype, getMaxSimpleBody} from "@/creep/creepBodyManager";
import {HarvestStationMem} from "@/access_memory/harvestStationMem";


export function mount() {
    api.nothing();     //api
    SuperMove.nothing();    //move module
    MemHack.pretick();      //memory hack
    mountExtensions();
}

export function runDptHarvest(roomName: string) {
    const dptHarvestMem = Memory['colony'][roomName]['dpt_harvest'];
    // for each harvest station
    for (let stationName in dptHarvestMem) {
        const harvestStation = new HarvestStation(roomName, stationName as HarvestStationType);
        harvestStation.run();
    }
}

export function runCreepSpawning(roomName: string) {
    const creepSpawningMem = Memory['colony'][roomName]['creepSpawning'];
    const creepSpawning = new CreepSpawning(roomName);
    creepSpawning.run();
}

export function runDpt() {
    const colonyMem = Memory['colony'];
    // for each room in colony
    for (let roomName in colonyMem) {
        runDptHarvest(roomName);
        runCreepSpawning(roomName);

    }
}

export function test(){
    const harvestMem = new HarvestStationMem('W7N7', 'source1');
    console.log(harvestMem.getOrder());
    harvestMem.removeOrder();
}

module.exports.loop = function() {
    mount();

    runDpt();

}