import {iniColony} from "./init_mem/ini_index";


global.api = {
    createColony(roomName: string) : string {

        iniColony(roomName);
        return 'Colony ' + roomName  + ' created';
    }
}

export function nothing(): number {
    return 0;
}