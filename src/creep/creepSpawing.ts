import {getBody, getEnergyRCL, ticksToSpawn} from "@/creep/creepBody";

export class CreepSpawning {
    roomName: string;
    memory: CreepSpawnMemory;

    constructor(roomName: string) {
        this.roomName = roomName;
        this.memory = Memory['colony'][roomName]['creepSpawning'];
    }

    /****************************  SPAWN CONFIG  ******************************/
    public addSpawnId(spawnId: string): void {
        this.memory['spawnId'].push(spawnId);
    }
    private deleteSpawnId(spawnId: string): void {
        let spawnIdList = this.memory['spawnId']
        let index = spawnIdList.indexOf(spawnId);
        spawnIdList.splice(index, 1);
    }

    /****************************  SPAWN TASK  ******************************/
    public addSpawnTask(creepName: string ,spawnTask: CreepSpawnConfig): void {
        const priority = spawnTask.priority;
        const body = spawnTask.body;
        const creepMemory = spawnTask.creepMemory;

        const aux: SpawnTask = {
            body: body,
            creepMemory: creepMemory,
        }
        this.memory.spawnTask[priority.toString()][creepName] = aux;
        console.log('addSpawnTask: ' + creepName + ' provide by station ' + creepMemory.workStationID);
    }

    private deleteSpawnTask(creepName: string): void {
        for (let priority = 0; priority < 3; priority++) {
            let spawnTaskList = this.memory.spawnTask[priority.toString()];
            if (spawnTaskList[creepName]) {
                delete spawnTaskList[creepName];
                console.log('deleteSpawnTask: ' + creepName);
            }
        }
    }

    private spawnCreep(spawnId: string, creepName: string, spawnTask: SpawnTask): ScreepsReturnCode {
        const spawn = Game.getObjectById(spawnId as Id<StructureSpawn>);
        //const body = spawnTask.body;
        const energyRCL = getEnergyRCL(Game.rooms[this.roomName].energyCapacityAvailable);
        const body = getBody(spawnTask.creepMemory.role, energyRCL, spawnTask.body);
        //console.log(spawnTask.creepMemory.role + ' ' + energyRCL + ' ' + spawnTask.body);
        //console.log(body)
        const creepMemory = spawnTask.creepMemory;
        const result = spawn.spawnCreep(body, creepName, { memory: creepMemory });
        return result;
    }

    private setCreepDeadTime(creepName: string, spawnTask: SpawnTask) {
        const creepDeadTick = Memory['colony'][this.roomName][spawnTask.creepMemory.departmentName][spawnTask.creepMemory.workStationID]['creepDeadTick'];
        const energyRCL = getEnergyRCL(Game.rooms[this.roomName].energyCapacityAvailable);

        creepDeadTick[creepName] = Game.time + 1501 + ticksToSpawn(spawnTask.creepMemory.role, energyRCL);
    }
    run(): void {
        for (const spawnId of this.memory.spawnId) {
            const spawn = Game.getObjectById(spawnId as Id<StructureSpawn>);

            if (spawn.spawning) {
                continue;
            }
            for (let priority = 0; priority < 3; priority++) {
                const spawnTaskList:SpawnTaskSet = this.memory.spawnTask[priority];
                const creepName = Object.keys(spawnTaskList)[0];
                if (creepName) {
                    let spawnTask = spawnTaskList[creepName];
                    const creepResult = this.spawnCreep(spawnId, creepName, spawnTask);
                    if (creepResult == OK) {
                        this.deleteSpawnTask(creepName);
                        this.setCreepDeadTime(creepName ,spawnTask);
                    }
                    break;
                }
            }
        }
    }

}