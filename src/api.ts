import {iniColony} from "./init_mem/ini_index";


global.api = {
    createColony(roomName: string) : string {

        // set flag called 'pa' and 'pb' in the energy source of then room
        const room = Game.rooms[roomName];

        // only energy source
        const sources = room.find(FIND_SOURCES);
        room.createFlag(sources[0].pos, 'pa');
        room.createFlag(sources[1].pos, 'pb');
        room.createFlag(room.controller.pos, 'pc');
        const mineral = room.find(FIND_MINERALS)[0];
        room.createFlag(mineral.pos, 'pm');

        const auxPos = new RoomPosition(25, 25, roomName);
        room.createFlag(auxPos, 'p');

        iniColony(roomName);
        return 'Colony ' + roomName  + ' created';
    },


}

export function nothing(): number {
    return 0;
}