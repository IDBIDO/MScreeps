import {iniColony} from "./init_mem/ini_index";
import {BuildStation} from "@/stations/buildStation";


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


    // test functions
    testBuildStation(){
        const buildStation = new BuildStation("W7N7", "internal_build");
        const buildTask: BuildTaskData = {
            department: "dpt_harvest",
            id: "",
            index: null,
            pos: [15, 11],
            roomName: "W7N7",
            stationType: "source1",
            structureType: "container"
        }

        buildStation.searchAndSaveCompleteStructure(buildTask);
        const r = Memory["colony"]["dpt_harvest"]["source1"]["order"]
        console.log(r)
    }


}

export function nothing(): number {
    return 0;
}