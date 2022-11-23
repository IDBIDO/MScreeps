import {getBody, getEnergyRCL} from "@/colony/creepBodyData";

export class CreepSpawning {
    roomName: string;
    memory: {};

    constructor(roomName: string) {
        this.roomName = roomName;
        this.memory = Memory['colony'][roomName]['creepSpawning'];
    }

    getSpawnIdList(): string[] {
        return this.memory['spawnId'];
    }

    getSpawnTaskList(priority: number): SpawnTask[] {
        return this.memory['spawnTask'][priority];
    }

    addSpawnTask(spawnTask: SpawnTask, priority: number) {
        this.memory['spawnTask'][priority].push(spawnTask);
    }

    addSpawnId(spawnId: string) {
        this.memory['spawnId'].push(spawnId);
    }

    removeSpawnId(spawnId: string) {
        let spawnIdList = this.getSpawnIdList();
        let index = spawnIdList.indexOf(spawnId);
        spawnIdList.splice(index, 1);
    }

    removeSpawnTask(spawnTask: SpawnTask, priority: number) {
        let spawnTaskList = this.getSpawnTaskList(priority);
        let index = spawnTaskList.indexOf(spawnTask);
        spawnTaskList.splice(index, 1);
    }

    getSpawnTaskByCreepName(creepName: string): SpawnTask {
            for (let priority = 0; priority < 3; priority++) {
                let spawnTaskList = this.getSpawnTaskList(priority);
                for (let spawnTask of spawnTaskList) {
                    if (spawnTask.creepName == creepName) {
                        return spawnTask;
                    }
                }
            }
            return null;

    }

    getCreepConfig(spawnTask: SpawnTask) {
        return Memory['colony'][this.roomName][spawnTask.departmentName][spawnTask.workStationId]['creepConfig'];
    }

    spawnCreep(spawnTask: SpawnTask, spawnId: string) {
        let spawn = Game.getObjectById(spawnId as Id<StructureSpawn>);
        let creepName = spawnTask.creepName;
        let creepConfig = this.getCreepConfig(spawnTask);
        let creepMemory = creepConfig['memory'];

        let energyRCL = getEnergyRCL(Game.rooms[this.roomName].energyCapacityAvailable);

        let creepBody = getBody(creepMemory['role'], energyRCL, 'default');


        let creepResult = spawn.spawnCreep(creepBody, creepName, {memory: creepMemory});
        if (creepResult == OK) {
            this.removeSpawnTask(spawnTask, creepConfig['priority']);
            //this.removeSpawnId(spawnId);
        }
    }

    run() {
        for (let spawnId of this.getSpawnIdList()) {
            let spawn = Game.getObjectById(spawnId as Id<StructureSpawn>);
            if (spawn.spawning) {
                continue;
            }
            for (let priority = 0; priority < 3; priority++) {
                let spawnTaskList = this.getSpawnTaskList(priority);
                if (spawnTaskList.length > 0) {
                    let spawnTask = spawnTaskList[0];
                    this.spawnCreep(spawnTask, spawnId);
                    break;
                }
            }
        }
    }


}