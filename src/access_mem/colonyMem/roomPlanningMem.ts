

export default class RoomPlanningMem {

    rootMem: {};
    dpt_name: memConstant = 'roomPlanning';

    constructor(mainRoom: string) {
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name]['model'];
    }

    static getStructureList(roomName: string, structureType: string) {
        return Memory['colony'][roomName]['roomPlanning']['model'][structureType];
    }

    static getSource1Data(roomName): modelData {
        return Memory['colony'][roomName]['roomPlanning']['model']['source'][0];
    }

    static getSource2Data(roomName): modelData {
        return Memory['colony'][roomName]['roomPlanning']['model']['source'][1];
    }

    static getMineralData(roomName): modelData {
        return Memory['colony'][roomName]['roomPlanning']['model']['source'][2];
    }







}