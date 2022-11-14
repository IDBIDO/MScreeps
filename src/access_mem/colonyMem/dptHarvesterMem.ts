import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";

export default class DptHarvesterMem {

    rootMem: {};
    dpt_name: memConstant = 'dpt_harvest';

    constructor(mainRoom: string) {
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name];
    }

    getWorkPosition(): WorkStationData {
        return this.rootMem['workPosition'];
    }
    addWorkStation(workStationId: string, data: {}) {
        this.rootMem['workStation'][workStationId] = data;
    }

    deleteWorkPosition(pos: WorkStationData) {
        let index = this.rootMem['workPosition'].indexOf(pos);
        this.rootMem['workPosition'].splice(index, 1);
    }

    getTargets(): HarvesterTargets {
        return this.rootMem['targets'];
    }

    setTargets(targets: HarvesterTargets) {
        this.rootMem['targets'] = targets;
    }

    getCreepsDeadTick(): {} {
        return this.rootMem['creepsDeadTick'];
    }

    addCreepsDeadTick(creepName: string, tick: number) {
        this.rootMem['creepsDeadTick'][creepName] = tick;
    }

    deleteCreepsDeadTick(creepName: string) {
        delete this.rootMem['creepsDeadTick'][creepName];
    }




}



