import {HarvestStationMem} from "@/access_memory/harvestStationMem";
import {LogisticStationMem} from "@/access_memory/logisticStationMem";
import {BuildStationMem} from "@/access_memory/buildStationMem";

export class RealiseLogisticOrder {

    roomName: string;
    stationType: LogisticStationType
    mem: LogisticStationMem

    constructor(roomName: string) {
        this.roomName = roomName;
        this.stationType = "internal_transport"
        this.mem = new LogisticStationMem(this.roomName, "internal_transport");
    }

    run() {
        this.checkHarvestStation("source1");
        this.checkHarvestStation("source2");
        this.checkBuildStation("internal_build");
    }

    private createTask(taskType: "MOVE" | "WITHDRAW" | "TRANSFER", resourceType: ResourceConstant, stationDpt: DepartmentName,
                       stationId: string, taskObjectInfo: ID_Room_position, amount: number):TransporterTaskData {
        return {
            amount: amount,
            creepName: null,
            resourceType:resourceType,
            stationDpt: stationDpt,
            stationId: stationId,
            taskObjectInfo: taskObjectInfo,
            taskType: taskType

        };
    }

    private checkBuildStation(stationType: BuildStationType) {
        const buildMem = new BuildStationMem(this.roomName, stationType);
        const creepDeadTick = Object.keys(buildMem.getCreepDeadTick());
        //if (creepDeadTick.length == 0) return;
        for (let i = 0; i < creepDeadTick.length; ++i) {
            const creep = Game.creeps[creepDeadTick[i]];
            if (creep && !this.mem.existTask(creepDeadTick[i], "TRANSFER") ) {
                const creepInfo = {
                    id: creep.id,
                    pos: null,
                    roomName: null
                }
                const aux = this.createTask("TRANSFER", "energy", "dpt_build",
                    stationType, creepInfo, null);
                this.mem.getTask().TRANSFER[creepDeadTick[i]] = aux;
            }
        }
    }

    private checkHarvestStation(stationType: HarvestStationType) {

        const harvestMem = new HarvestStationMem(this.roomName, stationType);
        const targetInfo = harvestMem.getUsage().targetInfo;

        if (!targetInfo.id) return;


        const target = Game.getObjectById(targetInfo.id as Id<ConstructionSite> |
        Id<StructureContainer>);


        if (target instanceof ConstructionSite) {
            // create Move task if no Move task exist

            if (!this.mem.existTask(stationType, "MOVE")) {

                const creepDeadTick = Object.keys(harvestMem.getCreepDeadTick());
                if (harvestMem.getCreepDeadTick()[creepDeadTick[0]] == null) return;
                const creepInfo = {
                    id: creepDeadTick[0],
                    pos: null,
                    roomName: null
                }
                const aux = this.createTask("MOVE", "energy", "dpt_harvest",
                                 stationType, creepInfo, null);
                this.mem.getTask().MOVE[stationType] = aux;
            }
        } else {
            // create withdraw task if container have enough resources and delete Move task
            if (this.mem.existTask(stationType, "MOVE")) {
                this.mem.removeTask("MOVE", stationType);

            }
            if (target.store.getUsedCapacity() >= 800 && !this.mem.existTask(stationType, "WITHDRAW")) {
                const withDrawTask = this.createTask("WITHDRAW", "energy", "dpt_harvest",
                                 stationType, targetInfo, null);
                this.mem.getTask().WITHDRAW[stationType] = withDrawTask;
            }


        }


    }


}