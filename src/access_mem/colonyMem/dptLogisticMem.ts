
export default class DptLogisticMem {

    rootMem: {};
    dpt_name: memConstant = 'dpt_logistic';

    constructor(mainRoom: string) {
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name];
    }





}