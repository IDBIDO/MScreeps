// 游戏入口函数

import * as mScreeps from "./api/mScreeps"
import MemHack from "./external_modules/MemHack"
import * as SuperMove from "./external_modules/SuperMove"
import mountExtensions from "@/extensions/mountExtensions";
import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";
import {CreepSpawning} from "@/colony/creepSpawning";

export function mount() {
    SuperMove.nothing();
    MemHack.pretick();
    mScreeps.nothing();
    mountExtensions();
}

module.exports.loop = function() {

    mount();
    //let p: RoomPosition = new RoomPosition(5, 18, "W8N7");

    let harvesterStation = new HarvesterWorkStation("W8N7");


    // get reference for workStation o6vrzxlzq
    //let t = new HarvesterWorkStation("W8N7", "o6vrzxlzg");

    //let creepSpawning = new CreepSpawning("W8N7");

    //console.log(t.getData())
    //console.log(x)

    console.log(Game.time % 10)
    if (Game.time % 10 == 0) {
        harvesterStation.initializeHarvesterWorkStation('source1', '5bbcaeb9099fc012e186a3c3', [5, 18]);
        harvesterStation.saveToMemory()
        //console.log(harvesterStation.id)
        let mem = harvesterStation.getMemObject();
        console.log(mem.workPositions);
        mem.type = 'source2';
        mem.orders.push('addCreep');
        console.log(mem.type)
        console.log('SHIFT FIRST ELEMENT ' + harvesterStation.exeOrder());
        console.log('length afeter shift: ' +mem.orders.length);

        //harvesterStation.addOrder('ADD_CREEP');

    }

    //console.log(p['getAdjacentPositions']());
    //console.log('hello world')
    //console.log('hhhh')
    
}