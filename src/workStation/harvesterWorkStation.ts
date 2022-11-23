import {WorkStation} from "@/workStation/workStation";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import DptHarvesterMem from "@/access_mem/colonyMem/dptHarvesterMem";

export class HarvesterWorkStation extends WorkStation   {
    workPositions: [number, number, number][];  // workPosition[0] = x, workPosition[1] = y, workPosition[2]: 0|1 = ocupied?
    //mem: DptHarvesterMem;
    distanceToSpawn: number;
    constructor( roomName: string , id?: string ) {
        super(roomName ,id);

        this.sourceInfo = {
            sourceId: null,
            roomName: roomName,
            pos: null,
        }

        /*
        let auxMem = new DptHarvesterMem(this.sourceInfo.roomName);
        let auxData = auxMem.getWorkStation(this.id);
        //console.log(auxData)

        //console.log(auxMem.getWorkStation(this.id))
        this.mem = auxData;
        //console.log(this.mem)

         */

    }

    public getMemObject(): HarvesterWorkStationData {
        let mem = new DptHarvesterMem(this.sourceInfo.roomName);
        return mem.getWorkStation(this.id);
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
    public initializeHarvesterWorkStation(stationType: stationType, sourceId?: string, pos?: [number, number]) {

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
            body: 'default',        //default body option
            priority: 0,    //highest priority
            memory: {
                working: false,
                ready:  false,
                role: 'initializer',
                workStationID: this.id,
                departmentName:  'dpt_harvest',
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

        this.sourceInfo.pos =  pos;

        let roomName = this.sourceInfo.roomName;
        //let pos = this.sourceInfo.pos;

        this.workPositions = [];
        if(pos && roomName){
            let auxRoomPos = new RoomPosition(pos[0], pos[1], roomName);
            let adjPosList:RoomPosition[] = auxRoomPos['getAdjacentPositions']();
            for (let i in adjPosList){
                let auxPos = adjPosList[i];
                if (auxPos['isWalkable']())
                    this.workPositions.push([auxPos.x, auxPos.y, 0]);
            }
        }
    }

    protected getStationData(): HarvesterWorkStationData {
        return {
            type: this.type,
            orders: this.orders,

            workPositions: this.workPositions,
            creepList: this.creepList,

            sourceInfo: this.sourceInfo,
            targetInfo: this.targetInfo,

            creepConfig: this.creepConfig,

            distanceToSpawn: this.distanceToSpawn,
            needTransporterCreep: this.needTransporterCreep,
            transporterSetting: this.transporterSetting
        };
    }

    public saveToMemory(){
        let dptHarvestMem = new DptHarvesterMem(this.sourceInfo.roomName);
        dptHarvestMem.addWorkStation(this.id, this.getStationData());

        console.log('Harvester WS '+ this.id +' save to memory');
    }


}