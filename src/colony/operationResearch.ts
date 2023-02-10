import {ColonyStatus} from "@/colony/colonyStatus";
import {CreepSpawning} from "@/creep/creepSpawing";
import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";
import {SendOrder} from "@/workStation/sendOrder";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";

export class OperationResearch {

    roomName: string;

    constructor(roomName: string) {
        this.roomName = roomName;
    }

    private fase0(fase: number) {
        const colonyStatus = new ColonyStatus(this.roomName);
        const orStatus = colonyStatus.getOperationResearchState();

        switch (fase) {

            case 0:
                /*
                * 1. find spawn and save spawnID
                * 2. add source1 and source2 creeps
                * 3. add 1 transporter creep
                 */
                if (!orStatus) {
                    const room = Game.rooms[this.roomName];

                    // create source1 and source2 construction side
                    const roomPlanningMem = new RoomPlanningMem(this.roomName);
                    const source1Data = roomPlanningMem.getContainerSource1Data()
                    //console.log(source1Data);
                    const source2Data = roomPlanningMem.getContainerSource2Data()
                    //console.log(source2Data);
                    const r1 = room.createConstructionSite(source1Data.pos[0], source1Data.pos[1], STRUCTURE_CONTAINER);
                    const r2 = room.createConstructionSite(source2Data.pos[0], source2Data.pos[1], STRUCTURE_CONTAINER);
                    //console.log('return value of createConstructionSite: ' + r1 + ' ' + r2);
                    //save spawnID
                    const spawnID = room.find(FIND_MY_SPAWNS)[0].id;
                    const colonyStatus = new ColonyStatus(this.roomName);
                    colonyStatus.updateStorageID(spawnID);
                    const creepSpawn = new CreepSpawning(this.roomName);
                    creepSpawn.addSpawnId(spawnID);

                    //add source1 and source2 creeps
                    const sendOrder = new SendOrder(this.roomName);
                    sendOrder.harvester_sendOrder('source1', 'ADD_CREEP');
                    sendOrder.harvester_sendOrder('source2', 'ADD_CREEP');
                    sendOrder.harvester_sendOrder('source1', 'ADD_CREEP');
                    sendOrder.harvester_sendOrder('source2', 'ADD_CREEP');
                    sendOrder.harvester_sendOrder('source1', 'ADD_CREEP');
                    sendOrder.harvester_sendOrder('source2', 'ADD_CREEP');

                    // set source1 transporter creep
                    sendOrder.harvester_sendOrder('source1', 'SET_TRANSPORTER_CREEP');

                    // add one transporter creep
                    sendOrder.logistic_sendOrder('internal', 'ADD_CREEP', null);
                    colonyStatus.updateOperationResearchState(true);
                }

                /*
                * 1. check containers
                 */
                else {
                    //console.log('check containers');
                    const room = Game.rooms[this.roomName];
                    const containers = room.find(FIND_STRUCTURES, {
                        filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER;}
                    });

                    if (containers.length == 2) {
                        colonyStatus.updateFase(1);
                        colonyStatus.updateOperationResearchState(false);
                        const roomPlanningMem = new RoomPlanningMem(this.roomName);
                        const source1Data = roomPlanningMem.getSource1Data();

                        const harvesterWorkStation = new HarvesterWorkStation(this.roomName, 'source1');
                        const harvesterWorkStation2 = new HarvesterWorkStation(this.roomName, 'source2');
                        if (containers[0].pos.x == source1Data.pos[0] && containers[0].pos.y == source1Data.pos[1]) {
                            harvesterWorkStation.updateTargetInfo(containers[0].id, [containers[0].pos.x, containers[0].pos.y]);
                            harvesterWorkStation2.updateTargetInfo(containers[1].id, [containers[1].pos.x, containers[1].pos.y]);
                        } else {
                            harvesterWorkStation.updateTargetInfo(containers[1].id, [containers[1].pos.x, containers[1].pos.y]);
                            harvesterWorkStation2.updateTargetInfo(containers[0].id, [containers[0].pos.x, containers[0].pos.y]);
                        }


                    }
                }

                break;
            case 1:
                //1. build temporal container for store energy and spawn builders
                if (!orStatus) {
                    const room = Game.rooms[this.roomName];
                    const modelPlanningMem = new RoomPlanningMem(this.roomName);
                    const storageList = modelPlanningMem.getStructureInfoList('storage');
                    //room.createConstructionSite(storageList[0].pos[0], storageList[0].pos[1], STRUCTURE_CONTAINER);

                    const sendOrder = new SendOrder(this.roomName);
                    sendOrder.builder_sendOrder('internal', 'ADD_CREEP', null);
                    const orderData: AddConstructionSideData = {
                        added: false, index: 0, pos: [storageList[0].pos[0], storageList[0].pos[0]], roomName: this.roomName, type: 'storage'

                    }
                    sendOrder.builder_sendOrder('internal', 'ADD_CONSTRUCTION_SITE', orderData);

                    const upgraderContainerInfo = modelPlanningMem.getContainerUpgradeData();
                    const orderData
                    sendOrder.builder_sendOrder('internal', 'ADD_CONSTRUCTION_SITE', )

                } else {

                }


                break;
            case 2:
                // 2. build upgrader container and spawn upgraders
                break;

        }
    }
    public run() {

        const colonyStatus = new ColonyStatus(this.roomName);
        const buildRCL = colonyStatus.getBuildRCL();
        const fase = colonyStatus.getFase();
        const orStatus = colonyStatus.getOperationResearchState();
        switch (buildRCL) {
            case 0:
                this.fase0(fase);
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
        }


    }

}