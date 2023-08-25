import * as api from "./api";
import mountExtensions from "./extensions/mountExtensions";
import MemHack from "./external_modules/MemHack"
import * as SuperMove from "./external_modules/SuperMove"
import {HarvestStation} from "@/stations/harvestStation";
import {CreepSpawning} from "@/creep/creepSpawing";


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

module.exports.loop = function() {

    runDpt();

    mount();
}