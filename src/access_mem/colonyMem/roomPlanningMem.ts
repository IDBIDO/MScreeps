

export default class RoomPlanningMem {

    rootMem: {};
    dpt_name: memConstant = 'roomPlanning';

    constructor(mainRoom: string) {
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name];
    }


}