
export default class DptHarvesterMem {

    rootMem: {};
    dpt_name: memConstant = 'dpt_harvest';

    constructor(mainRoom: string) {
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name];
    }



}