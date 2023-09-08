import {LogisticStationMem} from "@/access_memory/logisticStationMem";

export class BuildStationMem {

    roomName: string;

    rootMem: {};
    stationType: BuildStationType;

    constructor(roomName: string, stationName: BuildStationType) {
        this.roomName = roomName;
        this.stationType = stationName;
        this.rootMem = Memory['colony'][roomName]['dpt_build'][stationName];
    }

    /***************** CONSULTER *****************/
    getCreepConfig(): CreepSpawnConfig {
        return this.rootMem['creepConfig'];
    }

    getCreepDeadTick(): {[creepName: string]: number} {
        return this.rootMem['creepDeadTick'];
    }

    getOrder(): {name: BuildStationOrder, data: {}}[] {
        return this.rootMem['order'];
    }

    getBuildTask(): {[level: number]: BuildTaskData[]} {
        return this.rootMem['buildTask'];
    }

    getHighPriorityBuildTask(): BuildTaskData {
        const buildTask:{[level: number]: BuildTaskData[]} = this.rootMem['buildTask'];
        for (let i = 0; i < 5; ++i) {
            if (buildTask[i].length > 0) return buildTask[i][0];
        }
        return null;
    }

    getTotalTaskCost(): number {
        const buildTask:{[level: number]: BuildTaskData[]} = this.rootMem['buildTask'];
        let totalCost = 0;
        for (let i = 0; i < 5; ++i) {
            for (let j = 0; j < buildTask[i].length; ++j) {
                //totalCost += buildTask[i][j].cost;
                const constructionType = buildTask[i][j].structureType;
                totalCost += CONSTRUCTION_COST[constructionType];
            }
        }
        return totalCost;
    }


    /***************** UPDATER *****************/
    addBuildTask(level: number, buildTaskData: BuildTaskData): void {
        this.rootMem['buildTask'][level].push(buildTaskData);

    }

    removeHighPriorityBuildTask(): void {
        const buildTask = this.rootMem['buildTask'];
        for (let i = 0; i < 5; ++i) {
            if (buildTask[i].length > 0) {
                buildTask[i].shift();
                break;
            }
        }
    }

    removeOrder(): void {

        this.rootMem['order'].shift();


    }


}