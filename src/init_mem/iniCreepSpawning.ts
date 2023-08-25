export function iniCreepSpawning(roomName: string) {
    Memory['colony'][roomName]['creepSpawning'] = {};
    Memory['colony'][roomName]['creepSpawning']['order'] = [];
    Memory['colony'][roomName]['creepSpawning']['spawnId'] = [];
    Memory['colony'][roomName]['creepSpawning']['spawnTask'] = {    //ordered by priority
        0: {},
        1: {},
        2: {},
    };

    // search for spawns in the room
    let spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);
    for (let i in spawns) {
        Memory['colony'][roomName]['creepSpawning']['spawnId'].push(spawns[i].id);
    }

}