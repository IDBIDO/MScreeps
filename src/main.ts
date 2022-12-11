// 游戏入口函数

import * as mScreeps from "./api/mScreeps"
import MemHack from "./external_modules/MemHack"
import * as SuperMove from "./external_modules/SuperMove"
import mountExtensions from "@/extensions/mountExtensions";
import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";
import {CreepSpawning} from "@/creep/creepSpawning";
import {LogisticWorkStation} from "@/workStation/logisticWorkStation";

export function mount() {
    SuperMove.nothing();
    MemHack.pretick();
    mScreeps.nothing();
    mountExtensions();
}

export function testHarvester() {
    let harvesterStation = new HarvesterWorkStation("W7N7");
    harvesterStation.initializeHarvesterWorkStationAndSave('source2');
    //harvesterStation.saveToMemory()
    //console.log(harvesterStation.id)
    let mem = harvesterStation.getMemObject();
    console.log(mem.workPosition);
    //mem.type = 'source2';
    console.log(harvesterStation.getID())
    console.log(mem.workPosition);
    harvesterStation.addOrder('ADD_CREEP');

    //harvesterStation.addOrder('DELETE_CREEP');
    harvesterStation.executeOrder();
    harvesterStation.run();
}

export function testLogistics() {
    let logisticsStation = new LogisticWorkStation("W7N7", 'interiorTransporter');
    logisticsStation.addOrder('ADD_CREEP');
    //logisticsStation.executeOrder();
    logisticsStation.run();
}

module.exports.loop = function() {

    mount();
    //return

    let harvesterStation = new HarvesterWorkStation("W7N7", "source1");


    // get reference for workStation o6vrzxlzq
    //let t = new HarvesterWorkStation("W8N7", "o6vrzxlzg");

    //let creepSpawning = new CreepSpawning("W8N7");

    //console.log(t.getData())
    //console.log(x)
    if (Game.time % 10 == 10) {
        let creepSpawning = new CreepSpawning("W7N7");
        creepSpawning.addSpawnId('f54a18f148a581e');
        console.log(creepSpawning.getSpawnIdList());
    }
    //console.log(Game.time)
    console.log(Game.time % 10)
    if (Game.time % 10 == 0) {

        //testHarvester();
        //testLogistics();
    }

    // creep spawning
    let creepSpawning = new CreepSpawning("W7N7");
    creepSpawning.run();


    for (let creep of Object.values(Game.creeps)) {
        creep['work']();
    }

    /*
    mScreeps.createColony('W7N7');


     */
}