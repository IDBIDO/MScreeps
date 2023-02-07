
import {iniColony} from "@/init_mem/ini_index";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import ColonyMem from "@/access_mem/colonyMem";
import {SendOrder} from "@/workStation/sendOrder";
import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";

global.mScreeps = {
    createColony(roomName: string) : string {
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

    addLogisticCreep(roomName: string): void {
        const sendOrder = new SendOrder(roomName);
        sendOrder.logistic_sendOrder('internal', 'ADD_CREEP', null);
        console.log('room ' + roomName + ' add logistic creep');
    },

    deleteLogisticCreep(roomName: string): void {
        const sendOrder = new SendOrder(roomName);
        sendOrder.logistic_sendOrder('internal', 'DELETE_CREEP', null);
        console.log('room ' + roomName + ' delete logistic creep');
    },

    // mScreeps.addBuilderCreep('W5N8')
    addBuilderCreep(roomName: string): void {
        const sendOrder = new SendOrder(roomName);
        sendOrder.builder_sendOrder('internal', 'ADD_CREEP', null);
        console.log('room' + roomName + 'add builder creep');
    },

    // mScreeps.addConstructionSide('W5N8')
    addConstructionSide(roomName: string): void {
        const sendOrder = new SendOrder(roomName);
        const addConst: AddConstructionSideData = {
            added: false,
            index: 0,
            pos: [22, 22],
            roomName: roomName,
            type: "road"
        }
        sendOrder.builder_sendOrder('internal', 'ADD_CONSTRUCTION_SITE', addConst)
    },


    //************* DEBUG **************

    // mScreeps.getFreeWorkStation('W5N8')
    getFreeWorkStation(roomName: string) {
      const harverstDPT = new HarvesterWorkStation(roomName, 'source1');
        console.log(harverstDPT.getFreeWorkPosition());
    }

}


export function nothing(){
    return "nothing"
}