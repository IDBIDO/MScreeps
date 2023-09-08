
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


    /***************** BUILD STATION *****************/

    getAdjacentRoadReference(structureType: StructureType, index: number): number[] {
        return this.rootMem['AdjacentRoadReference'][structureType][index];
    }

    getStructureReference(structureType: StructureType, pos: [number, number]): number {
        const model = this.getModel(structureType);
        for (let i = 0; i < model.length; ++i) {
            if (model[i].pos[0] == pos[0] && model[i].pos[1] == pos[1]) {
                return i;
            }
        }
        return -1;
    }

    setStructureId(structureType: StructureType, index: number, id: string): void {
        if (index != null)
            this.rootMem['model'][structureType][index].id = id;
    }

    getNoConstructedStructureIndex(structureType: StructureType): number {
        const model = this.getModel(structureType);
        for (let i = 0; i < model.length; ++i) {
            if (model[i].id == '') {
                return i;
            }
        }
    }

    setStructureSendToConstruct(structureType: StructureType, index: number): void {
        if (index != null)
            this.rootMem['model'][structureType][index].id = null;
    }

    structureTaskSent(structureType: StructureType, index: number): boolean {
        return this.rootMem['model'][structureType][index].id != '';
    }

    getRoadPathReferenceList(pathName: "spawn0ToSource1"| "spawn0ToSource2"| "spawn0ToController"| "spawn0ToMineral"): number[] {
        return this.rootMem['roadReference'][pathName];
    }

    getPositionFromReference(structureType: string ,reference: number): [number, number] {
        return this.rootMem['model'][structureType][reference].pos;
    }

}