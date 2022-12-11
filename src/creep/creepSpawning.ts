import {getBody, getEnergyRCL} from "@/creep/creepBodyData";

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

    getCreepSpawnConfig(department: departmentName, workStationId: string) {
        const creepConfig = Memory['colony'][this.roomName][department][workStationId]['creepConfig'];
        return creepConfig;
    }

    getCreepWorkPosition(creepName: string, department: departmentName, workStationId: string, creepIndex: number): RoomPosition {

        const creepList = Memory['colony'][this.roomName][department][workStationId]['creepList'];
        const creepState = creepList[creepIndex];
        const creepWorkPosition = creepState['workPosition'];
        if (!creepWorkPosition) return null;            // logistic department don't have workPosition
        const workRoomName = creepState['workRoomName'];
        return new RoomPosition(creepWorkPosition[0], creepWorkPosition[1], workRoomName);
    }

    addSpawnTask(spawnTask: SpawnTask) {
        const creepConfig = this.getCreepConfig(spawnTask);
        const priority = creepConfig['priority'];
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

    spawnCreep(spawnTask: SpawnTask, spawnId: string):ScreepsReturnCode {
        let spawn = Game.getObjectById(spawnId as Id<StructureSpawn>);
        let creepName = spawnTask.creepName;
        let creepConfig = this.getCreepConfig(spawnTask);
        let creepMemory:creepMemory = creepConfig['memory'];
        creepMemory.creepIndex = spawnTask.creepIndex;
        creepMemory.creepTask = spawnTask.creepTask;
        const workPos = this.getCreepWorkPosition(creepName, spawnTask.departmentName, spawnTask.workStationId, spawnTask.creepIndex);

        if (workPos) {
            creepMemory.creepTask.workPosition = {
                pos: [workPos.x, workPos.y],
                roomName: workPos.roomName
            }
        } else {
            creepMemory.creepTask.workPosition = null;
        }


        let energyRCL = getEnergyRCL(Game.rooms[this.roomName].energyCapacityAvailable);
        //console.log('energyRCL: '+energyRCL);

        let creepBody = getBody(creepMemory['role'], energyRCL, creepConfig['body']);
        //console.log('role: '+creepMemory['role']);
        //console.log('creepBody: '+creepBody);


        let creepResult = spawn.spawnCreep(creepBody, creepName, {memory: creepMemory});
        return creepResult;
    }

    private setCreepDeadTime(spawnTask: SpawnTask) {
        const creepList = Memory['colony'][this.roomName][spawnTask.departmentName][spawnTask.workStationId]['creepList'];
        const creepState = creepList[spawnTask.creepIndex];
        creepState['deadTick'] = Game.time + 1505;
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
                    const creepResult = this.spawnCreep(spawnTask, spawnId);
                    if (creepResult == OK) {
                        this.removeSpawnTask(spawnTask, priority);
                        this.setCreepDeadTime(spawnTask);
                        //this.removeSpawnId(spawnId);
                    }
                    break;
                }
            }
        }
    }


}