// 游戏入口函数

import * as mScreeps from "./api/mScreeps"
import MemHack from "./external_modules/MemHack"
import * as SuperMove from "./external_modules/SuperMove"
import mountExtensions from "@/extensions/mountExtensions";
import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";

export function mount() {
    SuperMove.nothing();
    MemHack.pretick();
    mScreeps.nothing();
}

module.exports.loop = function() {
    mountExtensions();
    mount();
    let p: RoomPosition = new RoomPosition(5, 18, "W8N7");

    let harvesterStation = new HarvesterWorkStation([31, 45], "W8N7");
    if (Game.time % 10 == 0) {
        //harvesterStation.createIniHarvesterWorkStation('source1');
        //harvesterStation.saveToMemory()
    }
    //console.log(p['getAdjacentPositions']());
    //console.log('hello world')
    //console.log('hhhh')
    
}