import { getEnergyRCL } from "@/creep/creepBody";

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

    protected abstract creepNumController();

    protected abstract structureController();

    run() {

        this.creepNumController();
        this.structureController();
    }



}