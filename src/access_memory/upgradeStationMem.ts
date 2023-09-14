export class UpgradeStationMem {
    roomName: string;

    rootMem: {};
    stationType: UpgraderStationType;

    constructor(roomName: string, stationName: UpgraderStationType) {
        this.roomName = roomName;
        this.stationType = stationName;
        this.rootMem = Memory['colony'][roomName]['dpt_upgrade'][stationName] as UpgradeStationMemory;

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

    getSourceInfo(): {id: string, pos: [number, number], roomName: string, type: 'container' | 'link' | null} {
        return this.rootMem['sourceInfo'];
    }

    getCurrentRCL(): number {
        return this.rootMem['currentRCL'];
    }

    isLevelUp(): boolean {
        return this.rootMem['levelUp'];
    }

    getWorkPos(type: "container" | "link"):[number, number][] {
        return this.rootMem[type + 'WorkPos'];
    }

    getWorkPosPath(type: "container" | "link"):number[] {
        return this.rootMem[type + 'Path'];
    }

    getWorkPosEntrance(type: "container" | "link"): number {
        return this.rootMem[type + 'PathEntrance'];
    }

    getContainerPos(roomName: string): [number, number] {
        const containerReference = Memory['colony'][roomName]['roomPlanning']['containerReference']["container_controller"];
        return Memory['colony'][roomName]['roomPlanning']['model']['container'][containerReference]['pos'];
    }

    getContainerReference(roomName: string): number {
        return Memory['colony'][roomName]['roomPlanning']['containerReference']["container_controller"];
    }

    getLinkPos(roomName: string): [number, number] {
        const auxLink = Memory['colony'][roomName]['roomPlanning']['linkReference']['link_controller'];
        return Memory['colony'][roomName]['roomPlanning']['model']['link'][auxLink]['pos'];
    }

    getLinkReference(roomName: string): number {
        return Memory['colony'][roomName]['roomPlanning']['linkReference']['link_controller'];
    }

    /***************** SETTER *****************/

    updateCurrentRCL(): void {
        this.rootMem['currentRCL'] = Game.rooms[this.roomName].controller.level;
    }

    updateLevelUp(levelUp: boolean): void {
        this.rootMem['levelUp'] = levelUp;
    }

    updateSourceInfo(id: string, pos: [number, number],  roomName: string, type: 'container' | 'link' | 'terminal'): void {
        this.rootMem['sourceInfo'] = {
            id: id,
            pos: pos,
            roomName: roomName,
            type: type,
        };
    }

    removeOrder(): void {
        this.rootMem['order'].shift();
    }




}