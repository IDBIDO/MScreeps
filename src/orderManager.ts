export class OrderManager {
    roomName: string;
    rootMem: {};
    constructor(roomName: string) {
        this.roomName = roomName;
        this.rootMem = Memory['colony'][roomName];
    }

    sendOrder(orderName: CreepControlOrder | "ADD_BUILD_TASK", data: {}, department: DepartmentName, stationType: StationType | null): void {
        if (stationType != null) {
            this.rootMem[department][stationType]['order'].push({
                name: orderName,
                data: data,
            });
        } else {
            this.rootMem[department]['order'].push({
                name: orderName,
                data: data,
            });
        }
    }

    sendIniOrder() {
        // for each harvest station send SEARCH_BUILDING_TASK & UPDATE_CREEP_NUM order
        const harvestStationList = this.rootMem['dpt_harvest'];
        for (let stationType in harvestStationList) {
            this.sendOrder('SEARCH_BUILDING_TASK', {}, 'dpt_harvest', stationType as HarvestStationType);
            this.sendOrder('UPDATE_CREEP_NUM', {}, 'dpt_harvest', stationType as HarvestStationType);
        }

        const buildStationList = this.rootMem['dpt_build'];
        for (let stationType in buildStationList) {
            this.sendOrder('SEARCH_BUILDING_TASK', {}, 'dpt_build', stationType as BuildStationType);
            //this.sendOrder('UPDATE_CREEP_NUM', {}, 'dpt_build', stationType as BuildStationType);
        }

        const logisticStationList = this.rootMem['dpt_logistic'];
        for (let stationType in logisticStationList) {
            this.sendOrder('SEARCH_BUILDING_TASK', {}, 'dpt_logistic', stationType as LogisticStationType);
        }

        // for creepSpawning search for spawn and add it to spawnID using UPDATE_BUILDING_INFO order
        const roomObject = Game.rooms[this.roomName];
        const spawnList = roomObject.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === 'spawn';
            }
        });
        for (let spawn of spawnList) {
            this.sendOrder('UPDATE_BUILDING_INFO', {targetInfo: {id: spawn.id, roomName: this.roomName, pos: [0,0]}}, 'creepSpawning', null);
        }

    }



}