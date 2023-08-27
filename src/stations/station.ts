import {CreepSpawnMem, creepSpawnMem} from "@/access_memory/creepSpawnMem";

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

    public getCreepNum(): number {
        return Object.keys(this.rootObject['creepDeadTick']).length;
    }





}