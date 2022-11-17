import {WorkStation} from "@/workStation/workStation";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import DptHarvesterMem from "@/access_mem/colonyMem/dptHarvesterMem";

export class HarvesterWorkStation extends WorkStation   {
    departmentName: departmentName;


    constructor(departmentName: departmentName ,id?: string, pos?: [number, number], roomName?: string) {
        super(id ,pos, roomName);
        this.departmentName = departmentName;
        this.sourceInfo = {
            sourceId: null,
            roomName: roomName,
            pos: pos,
        }
    }

    getSource1ID(): string {
        return RoomPlanningMem.getSource1Id(this.sourceInfo.roomName);
    }

    getSource2ID(): string {
        return RoomPlanningMem.getSource2Id(this.sourceInfo.roomName);
    }

    getMineralID(): string {
        return RoomPlanningMem.getMineralId(this.sourceInfo.roomName);
    }

    getRoomSourceID(stationType: stationType): string {
        if (stationType == 'source1') {
            return this.getSource1ID();
        }
        else if (stationType == 'source2') {
            return this.getSource2ID();
        }
        else if (stationType == 'mineral') {
            return this.getMineralID();
        }
    }

    // only to create new work station
    //sourceId only for highway
    public initializeHarvesterWorkStation(stationType: stationType, sourceId?: string) {

        this.type = stationType;
        //this.orders = [];
        //this.creepList = [];
        if(sourceId){
            this.sourceInfo.sourceId = sourceId;
        }
        else this.sourceInfo.sourceId = this.getRoomSourceID(stationType);

        this.targetInfo = {
            targetId: null,
            roomName: this.sourceInfo.roomName,
            pos: null,
        };

        this.creepConfig = {
            role: 'initializer',
            body: 0,        //default body option
            priority: 0,    //highest priority
            memory: {
                working: false,
                ready:  false,
                workStationID: this.id,
                departmentName:  this.departmentName,
                roomName:  this.sourceInfo.roomName,
                dontPullMe: false,
            }
        };

        //this.distanceToSpawn = this.getDistanceToNearSpawn(pos, roomName);

        this.needTransporterCreep = true;       //need transporter creep to transport energy to spawn
        this.transporterSetting = {
            stationId : this.id,
            needWithdraw: true,
            amount: -1,
            resourceType: RESOURCE_ENERGY,
        };

    }

    public saveToMemory(){
        let dptHarvestMem = new DptHarvesterMem(this.sourceInfo.roomName);
        dptHarvestMem.addWorkStation(this.id, this.getStationData());
        console.log('Harvester WS '+ this.id +' save to memory');
    }

    protected executeOrders() {

    }


}