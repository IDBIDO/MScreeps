export class CreepSpawningMem {
    roomName: string;
    rootMem: {};

    constructor(roomName: string) {
        this.roomName = roomName;
        this.rootMem = Memory['colony'][roomName]['creepSpawning'];
    }

    getSpawnId(): string[] {
        return this.rootMem['spawnId'];
    }

    getSpawnTask(priority: number): SpawnTask[] {
        return this.rootMem['spawnTask'][priority];
    }

    addSpawnTask(spawnTask: SpawnTask, priority: number) {
        this.rootMem['spawnTask'][priority].push(spawnTask);
    }

    deleteSpawnTask(spawnTask: SpawnTask, priority: number) {
        let index = this.rootMem['spawnTask'][priority].indexOf(spawnTask);
        this.rootMem['spawnTask'][priority].splice(index, 1);
    }

    addSpawnId(spawnId: string) {
        this.rootMem['spawnId'].push(spawnId);
    }

    deleteSpawnId(spawnId: string) {
        let index = this.rootMem['spawnId'].indexOf(spawnId);
        this.rootMem['spawnId'].splice(index, 1);
    }




}