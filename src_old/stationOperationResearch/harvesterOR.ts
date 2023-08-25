import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import {StationORModel} from "@/stationOperationResearch/stationORModel";
import { HarvesterWorkStation } from "@/workStation/harvesterWorkStation";
import { SendOrder } from "@/workStation/sendOrder";

export class HarvesterOR extends StationORModel{

    dptName: string;
    mem : {HarvesterStationType: HarvestStationMemory};
    constructor(roomName: string) {
        super(roomName);
        this.dptName = 'dpt_harvest';
        this.mem = Memory['colony'][roomName][this.dptName];
    }

    protected creepNumController() {
        if (Game.time % 7 != 0) return;

        for (const stationType in this.mem) {
            if (stationType == 'mineral') {

            }
            else if (stationType != 'highway'){      // source1, or source2
                const harvesterStation = new HarvesterWorkStation(this.roomName, stationType as HarvesterStationType);
                const sendOrder = new SendOrder(this.roomName);
                const creepNum = harvesterStation.getCreepNum();
                if (creepNum == 0) {        // no harvest creep
                    sendOrder.harvester_sendOrder(stationType as StationType, 'ADD_CREEP');
                    sendOrder.harvester_sendOrder(stationType as StationType, 'ADD_CREEP');
                    sendOrder.harvester_sendOrder(stationType as StationType, 'ADD_CREEP');
                } else {        // check if need to delete creep
                    const energyRCL = this.getRnergyRCL();
                    if (creepNum > 2 && energyRCL == 2) {
                        sendOrder.harvester_sendOrder(stationType as StationType, 'DELETE_CREEP');
                    } else if (creepNum > 1 && energyRCL == 4) sendOrder.harvester_sendOrder(stationType as StationType, 'DELETE_CREEP');
                }
            }
        }

    }


    private getHarvesterTarget(stationType: HarvesterStationType): ID_Room_position {
        const harvesterStation = new HarvesterWorkStation(this.roomName, stationType);
        return harvesterStation.getTargetInfo();
    }

    protected structureController() {
        if (Game.time % 7 != 0) return;

        for (const stationType in this.mem) {
            if (stationType == 'mineral') {

            }
            else if (stationType != 'highway'){      // source1, or source2
                const harvesterStation = new HarvesterWorkStation(this.roomName, stationType as HarvesterStationType);
                const targetInfo = harvesterStation.getTargetInfo();
                if (targetInfo.id) {

                }
                else {      // create container
                    const room = Game.rooms[this.roomName];
                    const containerPos = harvesterStation.getContainerPos();


                    const r1 = room.createConstructionSite(source1Data.pos[0], source1Data.pos[1], STRUCTURE_CONTAINER);
                    const r2 = room.createConstructionSite(source2Data.pos[0], source2Data.pos[1], STRUCTURE_CONTAINER);

                }
            }
        }

    }




}