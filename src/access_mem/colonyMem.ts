import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import {CreepSpawningMem} from "@/access_mem/colonyMem/creepSpawningMem";
import {ColonyStatus} from "@/colony/colonyStatus";



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


    /*************************************** COLONY STATUS ACCESS ************************************/
    getColonyStatusMem(): ColonyStatusMemory {
        return this.mainRoot['colonyStatus'];
    }

    saveColonyStatus(data: object) {
        this.mainRoot['colonyStatus'] = data;
    }

    /*************************************** DEPARTMENTS ACCESS *************************************/

    // GET ALL WORK STATION OF DPT
    getDptWorkStationsMem(dptName: DepartmentName) {
        return this.mainRoot[dptName];
    }

    // GET SPECIFIC WORK STATION
    getWorkStationMem(dptName: DepartmentName, workStationId: StationType) {
        return this.mainRoot[dptName][workStationId];
    }

    addWorkStation(dptName: DepartmentName, workStationId: StationType, data: object): boolean {

        if (this.mainRoot[dptName][workStationId] == undefined) {
            this.mainRoot[dptName][workStationId] = data;
            return true;
        }
        return false;

    }











    









}