

export default class RoomPlanningMem {

    rootMem: {};
    roomName: string;
    dpt_name: memConstant = 'roomPlanning';

    constructor(mainRoom: string) {
        this.roomName = mainRoom;
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name]['model'];
    }

    getStructureList(structureType: string) {
        return Memory['colony'][this.roomName]['roomPlanning']['model'][structureType];
    }

    getSource1Data(): modelData {
        return Memory['colony'][this.roomName]['roomPlanning']['model']['source'][0];
    }

    getSource2Data(): modelData {
        return Memory['colony'][this.roomName]['roomPlanning']['model']['source'][1];
    }

    getMineralData(): modelData {
        return Memory['colony'][this.roomName]['roomPlanning']['model']['source'][2];
    }







}