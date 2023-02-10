

export default class RoomPlanningMem {

    rootMem: {};
    roomName: string;
    dpt_name=  'roomPlanning';

    constructor(mainRoom: string) {
        this.roomName = mainRoom;
        this.rootMem = Memory['colony'][mainRoom][this.dpt_name]['roomPlanning']['model'];
    }

    addStructureInfo(structureType: string, index: number, id: string) {
        this.rootMem[structureType][index]['id'] = id;

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

    getContainerSource1Data(): modelData {
            return Memory['colony'][this.roomName]['roomPlanning']['model']['container'][1];
    }

    getContainerSource2Data(): modelData {
            return Memory['colony'][this.roomName]['roomPlanning']['model']['container'][0];
    }

    getContainerUpgradeData(): modelData {
        return this.rootMem['container'][2];
    }

    getContainerMineral(): modelData {
        return this.rootMem['container'][3];
    }

    getStructureInfoList(structureName:  BuildableStructureConstant): modelData[] {
        return this.rootMem[structureName]
    }





}