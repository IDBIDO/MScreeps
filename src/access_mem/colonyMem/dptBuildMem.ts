
export default class DptBuildMem {

    rootMem: {};
    dpt_name: memConstant = 'dpt_build';

    constructor(mainRoom: string) {
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name];
    }





}