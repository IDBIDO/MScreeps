import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import { getEnergyRCL } from "@/creep/creepBody";
import { SendOrder } from "@/workStation/sendOrder";

export abstract class StationORModel {

    roomName: string;

    protected constructor(roomName: string) {
        this.roomName = roomName;
    }

    protected getRnergyRCL(): number {
        const room = Game.rooms[this.roomName];
        const energyCapacity = room.energyCapacityAvailable;
        const energyRCL = getEnergyRCL(energyCapacity);
        return energyRCL;
    }

    public createConstructionSite(structureType: BuildableStructureConstant, pos:[number, number], roomName: string, index: number): ScreepsReturnCode {
        const sendOrder = new SendOrder('W5N8');
        // check if construction site already exist
        const constructionSites = Game.rooms[roomName].lookForAtArea(LOOK_CONSTRUCTION_SITES, pos[1], pos[0], pos[1], pos[0], true);
        if (constructionSites.length > 0) return ERR_INVALID_TARGET;

        const orderData: AddConstructionSideData = {
            added: false, index: index, pos: pos, roomName: roomName, type: structureType
        }
        sendOrder.builder_sendOrder('internal', 'ADD_CONSTRUCTION_SITE', orderData);
        return OK;

    }

    protected abstract creepNumController();

    protected abstract structureController();

    run() {

    this.creepNumController();
    this.structureController();
    }



}