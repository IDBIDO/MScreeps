import {WorkStation} from "@/workStation/workStation";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import DptHarvesterMem from "@/access_mem/colonyMem/dptHarvesterMem";

export class HarvesterWorkStation extends WorkStation   {
    protected getCreepTask(): CreepTask {
        return undefined;
    }

    protected getMemObject(): object {
        return undefined;
    }

    protected getStationData(): HarvesterWorkStationData {
        return undefined;
    }

}