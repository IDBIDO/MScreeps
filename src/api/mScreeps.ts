import {Colony} from "@/colony/Colony"
import {iniRoomPlanning} from "@/init_mem/iniRoomPlanning";
import {iniColony} from "@/init_mem/ini_index";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import ColonyMem from "@/access_mem/colonyMem";

global.mScreeps = {
    createColony(roomName: string) : string{
        //mScreeps.createColony('W7N7');
        iniColony(roomName);
        const colonyMem = new ColonyMem(roomName);
        let spawnList: modelData[] = colonyMem.getRoomPlanningMem().getStructureList('spawn');
        const roomObject = new Room(roomName);
        //roomObject.createConstructionSite(spawnList[0].pos[0], spawnList[0].pos[1], STRUCTURE_SPAWN);
        roomObject.createFlag(spawnList[0].pos[0], spawnList[0].pos[1], 'spawn');
        return 'Colony ' + roomName  + ' created';
    },
    deleteColony(roomName: string):string {
        delete Memory['colony'][roomName];
        return "Colony " + roomName + " deleted" ;
    },


    //************* DEBUG **************


}




export function nothing(){
    return "nothinf"
}

