import {Station} from "@/stations/station";
import {HarvestStationMem} from "@/access_memory/harvestStationMem";
import {bodyProportion, bodyPrototype, getMaxSimpleBody, maxBodyProportion} from "@/creep/creepBodyManager";
import {OrderManager} from "@/orderManager";


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
    private static maxWorkBodyPartSource = bodyProportion.harvester[0]*maxBodyProportion.harvester;
    private static maxWorkBodyPartMineral = 12;

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
            console.log(order.name)
            switch (order.name) {
                case 'ADD_CREEP':
                    this.addCreep();
                    //console.log("add creep")
                    break;
                case 'REMOVE_CREEP':
                    this.removeCreep(order.data as {creepName: string});
                    break;
                case 'UPDATE_BUILDING_INFO':
                    this.updateBuildingInfo(order.data as {targetInfo: ID_Room_position});
                    break;
                case 'SEARCH_BUILDING_TASK':
                    this.searchBuildingTask();

                    //this.access_memory.removeOrder();

                    break;
                case 'UPDATE_CREEP_NUM':
                    this.updateCreepNum();
                    break;
                default:
                    break;
            }
            // delete executed order
            this.access_memory.removeOrder();
            //Memory['colony'][this.roomName]['dpt_harvest'][this.stationType]['order'] = []


        }


    }

    private updateCreepNum(): void {
        const creepBody = getMaxSimpleBody("harvester", this.roomName);
        const workBodyPartNum = creepBody.filter((part) => {
            return part === WORK;
        }).length;

        const creepNeeded = Math.ceil(HarvestStation.maxWorkBodyPartSource / workBodyPartNum);
        let actualCreepNum = Object.keys(this.access_memory.getCreepDeadTick()).length
        const taskNum = this.access_memory.getTask().length;
        // if actualCreepNum > creepNeeded, send REMOVE_CREEP order
        const orderManager = new OrderManager(this.roomName);
        if (actualCreepNum > creepNeeded) {
            let i = 0;
            while (actualCreepNum > creepNeeded) {
                orderManager.sendOrder('REMOVE_CREEP', {creepName: Object.keys(this.access_memory.getCreepDeadTick())[i] }, 'dpt_harvest', this.stationType as HarvestStationType);
                actualCreepNum--;
                i++;
            }
        } else if (actualCreepNum < creepNeeded) {
            // if actualCreepNum < creepNeeded, send ADD_CREEP order
            while (actualCreepNum < creepNeeded && actualCreepNum <= taskNum) {
                orderManager.sendOrder('ADD_CREEP', {}, 'dpt_harvest', this.stationType as HarvestStationType);
                actualCreepNum++;
            }
        }
    }

    maintenance(): void {
        this.renewCreeps();
        this.checkContainerConstructionSide();

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

    private checkContainerConstructionSide() {
        const targetInfo = this.access_memory.getUsage().targetInfo;
        if (targetInfo.id != null) {
            // @ts-ignore
            const object = Game.getObjectById(targetInfo.id);

            if (!object) {
                // search if there is a container in position targetInfo.pos
                const container = Game.rooms[this.roomName].lookForAt(LOOK_STRUCTURES, targetInfo.pos[0], targetInfo.pos[1]);
                // if yes, add container id to targetInfo.id
                if (container.length === 0) {
                    targetInfo.id = container[0].id;
                }
            }
        }

    }

    private searchBuildingTask(): void {
        const targetInfo = this.access_memory.getUsage().targetInfo;

        // TODO: change target to link if we can build a link

        if (targetInfo.id == null) {
            // create container construction site
            const containerReferenceOpt = "container_" + this.stationType;
            // @ts-ignore
            const containerPos = this.access_memory.getContainerPos(containerReferenceOpt);
            const result = Game.rooms[this.roomName].createConstructionSite(containerPos[0], containerPos[1], STRUCTURE_CONTAINER);



        }
    }



}