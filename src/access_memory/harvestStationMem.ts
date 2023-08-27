export class HarvestStationMem {

    roomName: string;

    rootMem: {};
    stationType: HarvestStationType;

    constructor(roomName: string, stationType: HarvestStationType) {
        this.roomName = roomName;
        this.rootMem = Memory['colony'][roomName]['dpt_harvest'][stationType];
        this.stationType = stationType;
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

    private getContainerReference(opt: "container_source1" | "container_source2" | "container_mineral"): number {
        return Memory['colony'][this.roomName]['roomPlanning']['containerReference'][opt];
    }

    getContainerPos(opt: "container_source1" | "container_source2" | "container_mineral"): [number, number] {
        const containerReference = this.getContainerReference(opt);
        return Memory['colony'][this.roomName]['roomPlanning']['model']['container'][containerReference]['pos'];
    }

    removeOrder(): void {

        this.rootMem['order'].shift();


    }



}