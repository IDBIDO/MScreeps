import * as mScreeps from "./mScreeps"
import MemHack from "./external_modules/MemHack"
import * as SuperMove from "./external_modules/SuperMove"
import mountExtensions from "@/extensions/mountExtensions";
import {CreepSpawning} from "@/creep/creepSpawing";
import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";
import {LogisticWorkStation} from "@/workStation/logisticWorkStation";
import {ColonyStatus} from "@/colony/colonyStatus";

//import { open } from 'node:fs/promises';

//import * as fileSystem from 'fs'
import _ from 'lodash';
import {OperationResearch} from "@/colony/operationResearch";
import {BuilderWorkStation} from "@/workStation/builderWorkStation";
import { SendOrder } from "./workStation/sendOrder";
import RoomPlanningMem from "./access_mem/colonyMem/roomPlanningMem";
export function mount() {
    mScreeps.nothing();     //api
    SuperMove.nothing();    //move module
    MemHack.pretick();      //memory hack
    mountExtensions();
}

export function testCreepSpawn() {
    const creepSpawn = new CreepSpawning('W5N8');
    if(Game.time%10 == 10) {
        creepSpawn.addSpawnId('ab0df59d224e771');
        const colonyStatus = new ColonyStatus('W5N8');
        colonyStatus.updateStorageID('ab0df59d224e771');
    }
    creepSpawn.run();

}



export function testHarvesterStation() {
    const station = new HarvesterWorkStation('W5N8', 'source1');
    if (Game.time%10 == 10) {
        const order: HarvesterWorkStationOrder = {
            name: "ADD_CREEP",
            data: null
        }
        station.addOrder(order);
    }
    if (Game.time%10 == 10) {
        const order: HarvesterWorkStationOrder = {
            name: "SET_TRANSPORTER_CREEP",
            data: null
        }
        station.addOrder(order);
        console.log('set transporter creep');
    }

    station.run();

}

export function testLogisticStation() {
    const station = new LogisticWorkStation('W5N8', 'internal');
    station.run();

}

export function testRunDPT() {
    const harvesterDPT = new HarvesterWorkStation('W5N8', 'source1');
    harvesterDPT.run();
    //console.log(1);
    const harvesterDPT2 = new HarvesterWorkStation('W5N8', 'source2');
    harvesterDPT2.run();
    //console.log(2);
    const logisticDPT = new LogisticWorkStation('W5N8', 'internal');
    logisticDPT.run();
    //console.log(3);

    const builderDPT = new BuilderWorkStation('W5N8', 'internal');
    builderDPT.run();
    //console.log(4)

    const creepSpawn = new CreepSpawning('W5N8');
    creepSpawn.run();
    if (Game.time%10 == 10) { creepSpawn.addSpawnId('4ce79638dbc2076');
        console.log(33)}
    //console.log(5);


}

module.exports.loop = function() {


    mount();
    //console.log(Game.time%10);
    //console.log(Game.cpu.bucket);

    //const container = Game.getObjectById('93fc539e23fc4b2' as Id<StructureContainer>)
    //console.log(container?.store.getUsedCapacity(RESOURCE_ENERGY));
    //console.log(container?.store.getFreeCapacity() + container?.store.getUsedCapacity());
    //console.log(container?.store.getCapacity());

    //return;

    const operationResearch = new OperationResearch('W5N8');
    operationResearch.run();

    testRunDPT();

    //console.log(Game.time%10);



    if (Game.time%10 == 10) {
        const sendOrder = new SendOrder('W5N8');
        sendOrder.logistic_sendOrder('internal', 'ADD_CREEP', null);
        /*
        const modelPlanningMem = new RoomPlanningMem('W5N8');
        const storageList = modelPlanningMem.getStructureInfoList('road');
        const orderData: AddConstructionSideData = {
            added: false, index: 0, pos: [storageList[0].pos[0], storageList[0].pos[1]], roomName: 'W5N8', type: 'road'

        }
        sendOrder.builder_sendOrder('internal', 'ADD_CONSTRUCTION_SITE', orderData);

         */

    }


    //@ts-ignore
    //const spawn = Game.getObjectById('9a493bc98e2584f')as StructureSpawn;//@ts-ignore
    //console.log(_.sum(spawn.store))

    for (let creep of Object.values(Game.creeps)) {
        creep['work']();
    }

    /*
    mScreeps.createColony('W5N8');
    */
}