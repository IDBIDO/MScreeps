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
                    this.access_memory.removeOrder();
                    break;
                case 'REMOVE_CREEP':
                    this.removeCreep(order.data as {creepName: string});
                    this.access_memory.removeOrder();
                    break;
                case 'UPDATE_BUILDING_INFO':
                    this.updateBuildingInfo(order.data as {targetInfo: ID_Room_position});
                    this.access_memory.removeOrder();
                    break;
                case 'SEARCH_BUILDING_TASK':
                    const a = this.searchBuildingTask();

                    if (a) this.access_memory.removeOrder();

                    break;
                case 'UPDATE_CREEP_NUM':
                    this.updateCreepNum();
                    this.access_memory.removeOrder();
                    break;
                default:
                    break;
            }
            // delete executed order
            ///this.access_memory.removeOrder();
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
            while (actualCreepNum < creepNeeded && actualCreepNum < taskNum) {
                orderManager.sendOrder('ADD_CREEP', {}, 'dpt_harvest', this.stationType as HarvestStationType);
                actualCreepNum++;
            }
        }
    }

    maintenance(): void {
        this.checkDeadCreep();
        this.renewCreeps();
        this.checkContainerConstructionSide();
        this.checkCreepTask();
    }

    private checkDeadCreep() {
        const creepDeadTickList = this.access_memory.getCreepDeadTick();
        for (let creepName in creepDeadTickList) {
            const creep = Game.creeps[creepName];
            if (!creep && creepDeadTickList[creepName] != null) {
                // unset creep task
                const task = Memory.creeps[creepName].task;
                if (task) {
                    this.unSetTaskOccupied(task);
                }

            }
        }
    }


    private getFreeTask(): [number, number, number] {
        const taskList = this.access_memory.getTask();
        for (let i = 0; i < taskList.length; ++i) {
            if (taskList[i][2] == 0) {
                return [taskList[i][0], taskList[i][1], 1]
            }
        }
        return null;
    }

    private setTaskOccupied(task: [number, number, number]): void {
        const taskList = this.access_memory.getTask();
        for (let i = 0; i < taskList.length; ++i) {
            if (taskList[i][0] == task[0] && taskList[i][1] == task[1]) {
                taskList[i][2] = 1;
                return;
            }
        }
    }

    private unSetTaskOccupied(task: [number, number, number]): void {
        const taskList = this.access_memory.getTask();
        for (let i = 0; i < taskList.length; ++i) {
            if (taskList[i][0] == task[0] && taskList[i][1] == task[1]) {
                taskList[i][2] = 0;
                return;
            }
        }
    }


    private checkCreepTask(): void {
        //console.log(this.getFreeTask())
        const creepDeadTickList = this.access_memory.getCreepDeadTick();
        for (let creepName in creepDeadTickList) {
            if(creepDeadTickList[creepName] && creepDeadTickList[creepName] > Game.time) {
                const creep = Game.creeps[creepName];
                if (creep) {
                    const task = creep.memory.task as number[];
                    if (task == null) {
                        const freeTask = this.getFreeTask();
                        if (freeTask) {
                            creep.memory.task = freeTask;
                            this.setTaskOccupied(freeTask);
                        }
                    }
                }

            }
        }
    }


    private addCreep(): void {
        // get no repeat creepName
        let creepName: string;
        do {
            creepName = this.getRandomName();
        } while (!this.checkCreepName(creepName));

        //get creepConfig
        const creepConfig = this.access_memory.getCreepConfig();
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        creepDeadTick[creepName] = null;

        // send creepSpawnTask
        this.sendCreepSpawnTask(creepName, creepConfig);
    }

    private removeCreep(data: {creepName: string}): void {
        // remove creepDeadTick
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        // unset creep task
        const creepTask = Memory.creeps[data.creepName].task;
        if (creepTask) {
            this.unSetTaskOccupied(creepTask);
        }
        delete creepDeadTick[data.creepName];
        delete Memory.creeps[data.creepName];
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
                if (container.length > 0) {
                    targetInfo.id = container[0].id;
                }
            }
        }

    }

    private searchBuildingTask(): boolean {
        const targetInfo = this.access_memory.getUsage().targetInfo;
        let orderComplete = false;
        // TODO: change target to link if we can build a link

        if (targetInfo.id == null) {

            // create container construction site
            const containerReferenceOpt = "container_" + this.stationType;
            // @ts-ignore
            const containerPos = this.access_memory.getContainerPos(containerReferenceOpt);

            const aux = this.access_memory

            const constructionSide = Game.rooms[this.roomName].lookAt(containerPos[0], containerPos[1]);

            constructionSide.forEach(function(lookObject) {
                if( lookObject.type == LOOK_CONSTRUCTION_SITES) {
                    aux.updateUsage({id: lookObject[LOOK_CONSTRUCTION_SITES].id,
                        pos: [lookObject[LOOK_CONSTRUCTION_SITES].pos.x, lookObject[LOOK_CONSTRUCTION_SITES].pos.y],
                    roomName: lookObject[LOOK_CONSTRUCTION_SITES].room.name})


                    orderComplete = true;
                }
                if (lookObject.type == LOOK_STRUCTURES) {
                    aux.updateUsage({id: lookObject[LOOK_STRUCTURES].id,
                        pos: [lookObject[LOOK_STRUCTURES].pos.x, lookObject[LOOK_STRUCTURES].pos.y],
                        roomName: lookObject[LOOK_STRUCTURES].room.name})
                    orderComplete = true;
                }
            });



            const result = Game.rooms[this.roomName].createConstructionSite(containerPos[0], containerPos[1], STRUCTURE_CONTAINER);


        } else orderComplete = true;
        return orderComplete
    }



}