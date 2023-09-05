import {CreepSpawnMem} from "@/access_memory/creepSpawnMem";
import {countStructure} from "@/utils";
import {bodyPrototype} from "@/creep/creepBodyManager";

export class CreepSpawning {

    roomName: string;
    access_memory: CreepSpawnMem;

    constructor(roomName: string) {
        this.roomName = roomName;
        this.access_memory = new CreepSpawnMem(roomName);
    }

    private executeOrder(): void {
        // get first order
        const firstOrder = this.access_memory.getOrder();
        if (firstOrder) {
            switch (firstOrder.name) {

                case 'UPDATE_BUILDING_INFO':
                    this.updateBuildingInfo(firstOrder.data as {targetInfo: ID_Room_position});
                    break;
                case 'SEARCH_BUILDING_TASK':
                    this.searchBuildingTask();
                    break;
            }

            // delete the first order
            this.access_memory.removeOrder();
        }
    }

    private updateBuildingInfo(data: {targetInfo: ID_Room_position}): void {
        // if the data is a spawn, add to spawnID, else do nothing

        // @ts-ignore
        if (Game.getObjectById(data.targetInfo.id).structureType === 'spawn') {
            this.access_memory.addSpawnID(data.targetInfo.id);
        }

    }

    private searchBuildingTask(): void {
        const numSpawn = countStructure(this.roomName, 'spawn');
        const numExtension = countStructure(this.roomName, 'extension');

        const roomObject = Game.rooms[this.roomName];
        const numSpawnAvailableToBuild = CONTROLLER_STRUCTURES.spawn[roomObject.controller.level] - numSpawn;
        const numExtensionAvailableToBuild = CONTROLLER_STRUCTURES.extension[roomObject.controller.level] - numExtension;

        // send spawn and extension build task
        // ... WAIT TO IMPLEMENT BUILD DEPARTMENT

    }

    private transformBodyFormat(bodyModel: { [key in BodyPartConstant]?: number }) {
        const body: BodyPartConstant[] = [];
        for (let bodyPart in bodyModel) {
            for (let i = 0; i < bodyModel[bodyPart]; i++) {
                body.push(bodyPart as BodyPartConstant);
            }
        }
        return body;
    }

    private sendCreepDeadTick(creepName: string, departmentName: DepartmentName, stationType: string, bodyNum: number): void {

        const spawnTime = bodyNum * 3;
        const creepDeadTickMem = Memory['colony'][this.roomName][departmentName][stationType]['creepDeadTick'];
        const creepDeadTick = Game.time + 1501 + spawnTime;
        creepDeadTickMem[creepName] = creepDeadTick;
        console.log('sendCreepDeadTick: ' + creepName + ' ' + creepDeadTick);
    }

    private executeSpawnTask(): void {
        const spawnTask = this.access_memory.getSpawnTask();
        const spawnIDList = this.access_memory.getSpawnID();

        // for each spawnID
        for (let spawnID of spawnIDList) {

            // get spawn
            const spawn = Game.getObjectById(spawnID as Id<StructureSpawn>)

            // if spawn is spawning, continue
            if (!spawn.spawning) {
                if (spawnTask) {

                    const creepName = spawnTask.creepName;

                    //this.transformBodyFormat(spawnTask.creepBody)
                    const creepBody = spawnTask.creepBody;


                    // print type of creepBody
                    const creepMemoryModel = spawnTask.creepMemory;
                    const creepMemory = JSON.parse(JSON.stringify(creepMemoryModel));
                    // spawn creep
                    const result = spawn.spawnCreep(creepBody, creepName, {memory: creepMemory});
                    if (result === OK) {

                        // set creepDeadTick
                        this.sendCreepDeadTick(creepName, creepMemory.departmentName, creepMemory.workStationID, creepBody.length);

                        // remove spawnTask
                        this.access_memory.removeSpawnTask(creepName);

                    }

                }
            }

        }

    }

    public run(): void {
        this.executeOrder();
        this.executeSpawnTask();
    }

}