import {WorkStation} from "@/workStation/workStation";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import DptHarvesterMem from "@/access_mem/colonyMem/dptHarvesterMem";

export class HarvesterWorkStation extends WorkStation   {


    constructor(pos: [number, number], roomName: string) {
        super(pos, roomName);
    }

    getSource1ID(): string {
        return RoomPlanningMem.getSource1Id(this.location.roomName);
    }

    getSource2ID(): string {
        return RoomPlanningMem.getSource2Id(this.location.roomName);
    }

    getMineralID(): string {
        return RoomPlanningMem.getMineralId(this.location.roomName);
    }

    public createIniHarvesterWorkStation(sourceNum: 'source1' | 'source2' | 'mineral'){
        this.needTransporterCreep = true;
        this.transporterSetting = this.createTransporterSetting(this.id, false, -1, RESOURCE_ENERGY);
        let sourceID: string;
        if (sourceNum === 'source1') {

            sourceID = this.getSource1ID();
        }
        else if (sourceNum === 'source2') { sourceID = this.getSource1ID();  }
        else if (sourceNum === 'mineral') { sourceID = this.getMineralID(); }
        this.creepConfig = this.createCreepSpawnConfig('iniHarvester', [WORK, WORK, CARRY, MOVE], 1, this.createHarvesterMemory(sourceID));

    }

    public saveToMemory(){
        let dptHarvestMem = new DptHarvesterMem(this.location.roomName);
        dptHarvestMem.addWorkStation(this.id, this.getStationData());
        console.log('Harvester WS '+ this.id +' save to memory');
    }



}