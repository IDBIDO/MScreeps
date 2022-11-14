

export default class RoomPlanningMem {

    rootMem: {};
    dpt_name: memConstant = 'roomPlanning';

    constructor(mainRoom: string) {
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name]['model'];
    }

    static getStructureList(roomName: string, structureType: string) {
        return Memory['colony'][roomName]['roomPlanning']['model'][structureType];
    }

    static getSource1Id(roomName) {
        return Memory['colony'][roomName]['roomPlanning']['model']['source'][0]['id'];
    }
    static getSource2Id(roomName) {
        return Memory['colony'][roomName]['roomPlanning']['model']['source'][1]['id'];
    }
    static getMineralId(roomName) {
        return Memory['colony'][roomName]['roomPlanning']['model']['source'][2]['id'];
    }






}