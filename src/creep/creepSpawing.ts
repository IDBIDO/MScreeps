import {CreepSpawnMem} from "@/access_memory/creepSpawnMem";
import {countStructure} from "@/utils";

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

    private executeSpawnTask(): void {
        const spawnTask = this.access_memory.getSpawnTask();
        const spawnIDList = this.access_memory.getSpawnID();

        // for each spawnID
        for (let spawnID of spawnIDList) {
            // get spawn
            const spawn = Game.getObjectById(spawnID as Id<StructureSpawn>)

            // if spawn is spawning, continue
            if (spawn.spawning) continue;
            if (spawnTask) {
                const creepName = spawnTask.creepName;
                const creepBody = spawnTask.creepBody;
                const creepMemory = spawnTask.creepMemory;

                // spawn creep
                const result = spawn.spawnCreep(creepBody, creepName, {memory: creepMemory});
                if (result === OK) {
                    // remove spawnTask
                    this.access_memory.removeSpawnTask(creepName);
                }
            }

        }


    }

    public run(): void {
        this.executeOrder();
        this.executeSpawnTask();
    }

}