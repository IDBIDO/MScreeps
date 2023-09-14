import {CreepSpawnMem, creepSpawnMem} from "@/access_memory/creepSpawnMem";
import {getMaxSimpleBody, transformBodyFormat} from "@/creep/creepBodyManager";

export abstract class Station {

    stationType: string;
    roomName: string;
    departmentName: DepartmentName;

    creepDeadTick: {[creepName: string]: number};
    creepConfig:  CreepSpawnConfig;

    rootObject: {};

    protected constructor(roomName: string,  stationType: StationType) {
        this.roomName = roomName;
        this.stationType = stationType;

    }

    abstract executeOrder(): void;
    abstract maintenance(): void;


    public run() {

        this.executeOrder();
        //this.updateData();


        this.maintenance();
    }

    public addOrder(order: {name: HarvestStationOrder, data: {}}): void {
        this.rootObject['order'].push(order);
    }

    public getCreepRole(): CreepRole {
        return this.rootObject['creepConfig']['creepMemory']['role'];
    }

    protected getCurrentBodyConfig() {
        const r = getMaxSimpleBody(this.getCreepRole(), this.roomName);
        const bodyPart = transformBodyFormat(r);
        return bodyPart;
    }

    /***************** UTILS *****************/

    protected getRandomName(): string {
        return this.stationType + '_' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }

    // check if creepName is repeated
    protected checkCreepName(creepName: string): boolean {
        const creepList = Game.creeps;
        for (let name in creepList) {
            if (name === creepName) return false;
        }
        return true;
    }


    protected sendCreepSpawnTask (creepName: string, spawnConfig: CreepSpawnConfig) {

        const spawnMem = new CreepSpawnMem(this.roomName);
        spawnMem.addSpawnTask(creepName, spawnConfig);
    }

    protected renewCreeps(): void {
        let mem = this.rootObject;
        const creepDeadTick: {[creepName: string]: number} = mem['creepDeadTick'];
        const creepConfig: CreepSpawnConfig = mem['creepConfig'];
        for (let creepName in creepDeadTick) {
            if (creepDeadTick[creepName] != null)
                if (creepDeadTick[creepName] <= Game.time) {
                    this.sendCreepSpawnTask(creepName, creepConfig);
                    creepDeadTick[creepName] = null;
                }
        }
    }

    private resetCreepStatus(creep: Creep): void {
        creep.memory.ready = false;
        creep.memory.working = false;
    }

    protected creepWaitingToSpawn(creepName: string):boolean {
        let mem = this.rootObject;
        const creepDeadTick: {[creepName: string]: number} = mem['creepDeadTick'];
        return creepDeadTick[creepName] == null;

    }

    public getCreepNum(): number {
        return Object.keys(this.rootObject['creepDeadTick']).length;
    }


    /***************** UTIL FUNCTIONS *****************/
    getStoredEnergy(): number {
        const storage = Game.rooms[this.roomName].storage;
        if (storage) return storage.store[RESOURCE_ENERGY];
        else {
            //search for containers and sum total energy stored
            const containers: StructureContainer[] = Game.rooms[this.roomName].find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            })
            let totalEnergy = 0;
            for (let i = 0; i < containers.length; ++i) {
                totalEnergy += containers[i].store[RESOURCE_ENERGY];
            }
            return totalEnergy;
        }
    }

    // body resource = body part * ticks to live if the creep
    getBodyResource(creepName: string, bodyPart: BodyPartConstant): number {
        //return creep.body.filter((body) => body.type == bodyPart).length * creep.ticksToLive;
        const creep = Game.creeps[creepName];
        if (creep) {
            if (creep.spawning)
                return creep.body.filter((body) => body.type == bodyPart).length * 1500;
            else return creep.body.filter((body) => body.type == bodyPart).length * creep.ticksToLive;
        }
        else {
            return 0;
        }
    }





}