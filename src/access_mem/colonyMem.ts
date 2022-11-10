import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import DptHarvesterMem from "@/access_mem/colonyMem/dptHarvesterMem";
import DptLogisticMem from "@/access_mem/colonyMem/dptLogisticMem";
import DptBuildMem from "@/access_mem/colonyMem/dptBuildMem";


export default class ColonyMem {

    mainRoomName: string;
    mainRoot: {};


    constructor(mainRoom: string) {
        this.mainRoomName = mainRoom;
        this.mainRoot = Memory['colony'][mainRoom];
    }

    /* Planning mem */
    getRoomPlanningMem(): RoomPlanningMem {
        return new RoomPlanningMem(this.mainRoomName);
    }

    /* Department harvester mem */
    getDptHarvesterMem(): DptHarvesterMem {
        return new DptHarvesterMem(this.mainRoomName);
    }

    /* Department logistic mem */
    getDptLogisticMem(): DptLogisticMem {
        return new DptLogisticMem(this.mainRoomName)
    }

    /* Department builder mem */
    getDptBuilderMem(): DptBuildMem {
        return new DptBuildMem(this.mainRoomName)
    }



    









}