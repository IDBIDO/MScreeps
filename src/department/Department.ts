/*
    workPosition:
    creepsDeadTick:





 */
export abstract class Department {
    roomName: string;
    type: departmentName      //department type, e.g. dpt_harvest
    memory: {};
    spawnTaskMemory: {};

    protected constructor(roomName: string, type: departmentName) {
        this.roomName = roomName;
        this.type = type;
        this.memory = Memory['colony'][roomName][type];
        this.spawnTaskMemory = Memory['colony'][roomName]['creepSpawning'];
    }

    
    abstract run(): void;
    

}