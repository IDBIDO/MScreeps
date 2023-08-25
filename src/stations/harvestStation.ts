import {Station} from "@/stations/station";
import {HarvestStationMem} from "@/access_memory/harvestStationMem";


/***
 creepDeadTick: {[creepName: string]: number};      // changes: maintenance & new extensions/spawn built
 creepConfig: CreepSpawnConfig;                     // new extensions/spawn built
 order: {name: HarvestStationOrder, data: {}}[];    // executeOrder

 usage: {                                           // new structure build
    sourceInfo: ID_Room_position;
    targetInfo: ID_Room_position;
 }

 task: [number, number, number][];                  // when body changes

 */

// We can set two types of update data orders:
// 1. updateBuilding: when a new structure is built
// 2. updateAvailableEnergy: when a new extension/spawn is built


export class HarvestStation extends Station{

    access_memory: HarvestStationMem;
    constructor(roomName: string, stationType: HarvestStationType) {
        super(roomName, stationType);
        this.access_memory = new HarvestStationMem(roomName, stationType);
        this.rootObject = Memory['colony'][roomName]['dpt_harvest'][stationType];
    }



    executeOrder(): void {
        //get order list
        const orderList = this.access_memory.getOrder();
        const order = orderList[0];
        if (order) {
            switch (order.name) {
                case 'ADD_CREEP':
                    this.addCreep();
                    break;
                case 'REMOVE_CREEP':
                    this.removeCreep(order.data as {creepName: string});
                    break;
                case 'UPDATE_BUILDING_INFO':
                    this.updateBuildingInfo(order.data as {targetInfo: ID_Room_position});
                    break;
                case 'SEARCH_BUILDING_TASK':
                    this.searchBuildingTask();
                    break;
                case 'UPDATE_CREEP_NUM':
                    this.updateCreepNum();
                    break;
            }
        }


    }

    private updateCreepNum(): void {
        // get creepNum
        const creepNum = this.getCreepNum();
        // get creepConfig
        const creepConfig = this.access_memory.getCreepConfig();
        // get creepDeadTick
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        // get task
        const task = this.access_memory.getTask();
        // get usage
        const usage = this.access_memory.getUsage();

        // if creepNum < task.length
        if (creepNum < task.length) {
            // add creep
            this.addCreep();
        } else if (creepNum > task.length) {
            // remove creep
            for (let creepName in creepDeadTick) {
                if (creepDeadTick[creepName] < Game.time) {
                    //this.sendCreepControlOrder('REMOVE_CREEP', {creepName: creepName});
                    break;
                }
            }
        }
    }

    maintenance(): void {
        this.renewCreeps();
    }

    private addCreep(): void {
        // get no repeat creepName
        let creepName: string;
        do {
            creepName = this.getRandomName();
        } while (!this.checkCreepName(creepName));

        //get creepConfig
        const creepConfig = this.access_memory.getCreepConfig();
        // send creepSpawnTask
        this.sendCreepSpawnTask(creepName, creepConfig);
    }

    private removeCreep(data: {creepName: string}): void {
        // remove creepDeadTick
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        delete creepDeadTick[data.creepName];
    }

    private updateBuildingInfo(data: {targetInfo: ID_Room_position}): void {
        this.access_memory.updateUsage(data.targetInfo);
    }

    private searchBuildingTask(): void {

    }



}