import {Colony} from "@/colony/Colony"
import {iniRoomPlanning} from "@/init_mem/iniRoomPlanning";

global.mScreeps = {
    createColony(roomName: string) : string{
        //mScreeps.createColony('W7N9');
        iniRoomPlanning(roomName);
        return "Planning of colony " + roomName + " created."

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

