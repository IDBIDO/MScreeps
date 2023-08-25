
export class RoomPlanningMem {

    roomName: string;
    rootMem: {};

    constructor(roomName: string) {
        this.roomName = roomName;
        this.rootMem = Memory['colony'][roomName]['roomPlanning'];
    }

    /***************** MODEL *****************/

    getModel(structureType: StructureType): ModelData[] {
        return this.rootMem['model'][structureType];
    }

    getSourceModel(num: number): ModelData {
        return this.rootMem['model']['source'][num];
    }

    getSourceID_Room_position(num: number): ID_Room_position {
        const sourceModel = this.getSourceModel(num);
        return {
            id: sourceModel.id,
            roomName: this.roomName,
            pos: sourceModel.pos,
        };
    }


}