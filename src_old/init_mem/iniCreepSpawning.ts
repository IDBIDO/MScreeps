export function iniCreepSpawning(roomName: string) {
    Memory['colony'][roomName]['creepSpawning'] = {};
    Memory['colony'][roomName]['creepSpawning']['spawnId'] = [];
    Memory['colony'][roomName]['creepSpawning']['spawnTask'] = {    //ordened by priority
        0: {},
        1: {},
        2: {},
    };


}