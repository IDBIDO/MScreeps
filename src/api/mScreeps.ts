import {Colony} from "@/colony/Colony"
import {iniRoomPlanning} from "@/init_mem/iniRoomPlanning";
import {iniColony} from "@/init_mem/ini_index";

global.mScreeps = {
    createColony(roomName: string) : string{
        //mScreeps.createColony('W7N9');
        iniColony(roomName);
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

