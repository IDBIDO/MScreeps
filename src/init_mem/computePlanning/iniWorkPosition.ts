
export function iniWorkPosition(roomName: string) {
    Memory['colony'][roomName]['workPositionOccupation'] = [];

    let occupationMap = iniOccupationMap(roomName);

    Memory['colony'][roomName]['workPositionOccupation'] = occupationMap;

}

export function iniOccupationMap(roomName: string): Array<number> {
    let occupationMap = new Array(50*50);
    const terrain = Game.map.getRoomTerrain(roomName);
    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            if (terrain.get(x, y) == TERRAIN_MASK_WALL) {
                occupationMap[x*50+y] = 1;
            } else {
                occupationMap[x*50+y] = 0;
            }
        }
    }
    return occupationMap;

}


