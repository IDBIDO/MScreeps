export class HarvestStationMem {

    roomName: string;

    rootMem: {};
    stationType: HarvestStationType;

    constructor(roomName: string, stationType: HarvestStationType) {
        this.roomName = roomName;
        this.rootMem = Memory['colony'][roomName]['dpt_harvest'][stationType];
    }

    /***************** CONSULTER *****************/

    getCreepConfig(): CreepSpawnConfig {
        return this.rootMem['creepConfig'];
    }

    getCreepDeadTick(): {[creepName: string]: number} {
        return this.rootMem['creepDeadTick'];
    }

    getOrder(): {name: HarvestStationOrder, data: {}}[] {
        return this.rootMem['order'];
    }

    getUsage(): {
        sourceInfo: ID_Room_position;
        targetInfo: ID_Room_position;
    } {
        return this.rootMem['usage'];
    }

    updateUsage(targetInfo: ID_Room_position): void {
        this.rootMem['usage']['targetInfo'] = targetInfo;
    }

    getTask(): [number, number, number][] {
        return this.rootMem['task'];
    }



    



}