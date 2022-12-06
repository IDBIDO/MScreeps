import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import {CreepSpawningMem} from "@/access_mem/colonyMem/creepSpawningMem";



export default class ColonyMem {

    mainRoomName: string;
    mainRoot: {};


    constructor(mainRoom: string) {
        this.mainRoomName = mainRoom;
        this.mainRoot = Memory['colony'][mainRoom];
    }

    /*************************************** ROOM PLANNING ACCESS ***************************************/

    /* Planning mem */
    getRoomPlanningMem(): RoomPlanningMem {
        return new RoomPlanningMem(this.mainRoomName);
    }

    /**************************************** CREEP SPAWNING ACCESS ******************************************/

    getCreepSpawningMem() {
        return new CreepSpawningMem(this.mainRoomName);
    }


    /*************************************** DEPARTMENTS ACCESS *************************************/

    // GET ALL WORK STATION OF DPT
    getDptWorkStationsMem(dptName: departmentName) {
        return this.mainRoot[dptName];
    }

    // GET SPECIFIC WORK STATION
    getWorkStationMem(dptName: departmentName, workStationId: StationType) {
        return this.mainRoot[dptName][workStationId];
    }

    addWorkStation(dptName: departmentName, workStationId: StationType, data: object): boolean {
        /*
        if (this.rootMem['workStation'][workStationId] == undefined) {
            this.rootMem['workStation'][workStationId] = data;
            return true;
        } else {
            return false;
        }
        */
        if (this.mainRoot[dptName][workStationId] == undefined) {
            this.mainRoot[dptName][workStationId] = data;
            return true;
        }
        return false;

    }











    









}