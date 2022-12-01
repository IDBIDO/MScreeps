import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";

export default class DptHarvesterMem {

    rootMem: {};
    dpt_name: memConstant = 'dpt_harvest';

    constructor(mainRoom: string) {
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name];
    }

    getWorkStation(id: string): HarvesterWorkStationData {
        //console.log(this.rootMem['workStation'][id])
        //console.log(id);
        return this.rootMem['workStation'][id];
    }

    addWorkStation(workStationId: string, data: {}): boolean {
        /*
        if (this.rootMem['workStation'][workStationId] == undefined) {
            this.rootMem['workStation'][workStationId] = data;
            return true;
        } else {
            return false;
        }
        */
        this.rootMem['workStation'][workStationId] = data;
        return true;
        //this.rootMem['workStation'][workStationId] = data;
    }

    deleteWorkPosition(pos: HarvesterWorkStationData) {
        let index = this.rootMem['workPosition'].indexOf(pos);
        this.rootMem['workPosition'].splice(index, 1);
    }

    getTargets(): HarvesterTargets {
        return this.rootMem['target'];
    }

    setTargets(targets: HarvesterTargets) {
        this.rootMem['target'] = targets;
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



