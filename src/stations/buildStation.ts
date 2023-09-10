import {Station} from "@/stations/station";
import {BuildStationMem} from "@/access_memory/buildStationMem";
import {getEnergyRCL} from "@/creep/creepBodyManager";
import {OrderManager} from "@/orderManager";
import {RoomPlanningMem} from "@/access_memory/roomPlanningMem";

export class BuildStation extends Station {
    access_memory: BuildStationMem;

    static level0 = [STRUCTURE_CONTAINER, STRUCTURE_LINK, STRUCTURE_STORAGE, STRUCTURE_TERMINAL, STRUCTURE_EXTRACTOR ]
    static level1 = [STRUCTURE_TOWER]
    static level2 = [STRUCTURE_ROAD]
    static level3 = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]

    static roadPath = ["spawn0ToSource1", "spawn0ToSource2", "spawn0ToController", "spawn0ToMineral"];
    // show me all structure type
    static manageStructure =
            [STRUCTURE_EXTENSION]
            //, STRUCTURE_RAMPART  // dpt_repairer
            //, STRUCTURE_ROAD      // dpt_builder, but no need to additional build task
            //, STRUCTURE_SPAWN     // creepSpawning
            //, STRUCTURE_LINK      // link manager
            //, STRUCTURE_STORAGE   // centreManager
            //, STRUCTURE_TOWER     // tower manager
            //, STRUCTURE_OBSERVER  // dpt_alert
            //, STRUCTURE_POWER_SPAWN   // dpt_boost
            //, STRUCTURE_EXTRACTOR]    // dpt_miner
            //, STRUCTURE_LAB    // dpt_boost
            //, STRUCTURE_TERMINAL  // centreManager
            //, STRUCTURE_CONTAINER     // dpt_harvest, dpt_logistic, dpt_upgrader, dpt_miner
            //, STRUCTURE_NUKER     // dpt_war
            //, STRUCTURE_FACTORY]    // centreManager
    constructor(roomName: string, stationType: BuildStationType) {
        super(roomName, stationType);
        this.access_memory = new BuildStationMem(roomName, stationType);
        this.rootObject = Memory['colony'][roomName]['dpt_harvest'][stationType];
    }

    executeOrder(): void {
        //get order list
        const orderList = this.access_memory.getOrder();
        const order = orderList[0];
        if (order) {
            console.log(order.name)
            switch (order.name) {
                case "ADD_CREEP":
                    //this.addCreep();
                    this.access_memory.removeOrder();
                    break;
                case "ADD_BUILD_TASK":
                    const buildTask = order.data as BuildTaskData;
                    this.addBuildTaskAndAdjacentRoads(buildTask);
                    this.access_memory.removeOrder();
                    break;

                case "SEARCH_BUILDING_TASK":
                    this.setExtensionBuildTask();
                    this.checkRoadPathTask();
                    this.access_memory.removeOrder();
                    break;
                default:
                    this.access_memory.removeOrder();
                    break;
            }
        }
    }

    private checkRoadPathTask() {
        const rcl = Game.rooms[this.roomName].controller.level;
        if (rcl >= 1) {
            this.createRoadPathTask("spawn0ToSource1");
            this.createRoadPathTask("spawn0ToSource2");
            this.createRoadPathTask("spawn0ToController");
        }
        if (rcl >= 6) {
            this.createRoadPathTask("spawn0ToMineral");
        }

    }

    private createRoadPathTask(pathName: "spawn0ToSource1"| "spawn0ToSource2"| "spawn0ToController"| "spawn0ToMineral") {
        const roomPlanningMem = new RoomPlanningMem(this.roomName);
        const roadPathReference = roomPlanningMem.getRoadPathReferenceList(pathName);
        for (let i = 0; i < roadPathReference.length; ++i) {
            const roadReference = roadPathReference[i];
            const roadModel = roomPlanningMem.getModel(STRUCTURE_ROAD)[roadReference];
            const roadPos = roadModel.pos;
            //const roadRoomPos = new RoomPosition(roadPos[0], roadPos[1], this.roomName);
            //roadRoomPos.createConstructionSite(STRUCTURE_ROAD);

            if (!roomPlanningMem.structureTaskSent(STRUCTURE_ROAD, roadReference)) {
                const roadBuildTask = this.createNoDptBuildTask(roadPos, this.roomName, STRUCTURE_ROAD, roadReference);
                const level = this.buildTaskHash(roadBuildTask);
                this.access_memory.addBuildTask(level, roadBuildTask);
                roomPlanningMem.setStructureSendToConstruct(STRUCTURE_ROAD, roadReference);
            }
        }

    }

    private setExtensionBuildTask(): void {
        const roomPlanningMem = new RoomPlanningMem(this.roomName);
        const extensionPos = roomPlanningMem.getModel(STRUCTURE_EXTENSION)
        const rcl = Game.rooms[this.roomName].controller.level;
        const extensionNum = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][rcl];
        const currentExtensionNum = Game.rooms[this.roomName].find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        })
        let extensionNeedToAdd = extensionNum - currentExtensionNum.length;
        while(extensionNeedToAdd > 0) {
            const extensionAvailableConstructIndex = roomPlanningMem.getNoConstructedStructureIndex(STRUCTURE_EXTENSION);
            const extensionAvailableConstructPos = roomPlanningMem.getModel(STRUCTURE_EXTENSION)[extensionAvailableConstructIndex].pos;
            const extensionBuildTask = this.createNoDptBuildTask(extensionAvailableConstructPos, this.roomName, STRUCTURE_EXTENSION, extensionAvailableConstructIndex);
            this.addBuildTaskAndAdjacentRoads(extensionBuildTask);
            extensionNeedToAdd--;
        }
    }

    private createNoDptBuildTask(pos: [number, number], roomName: string, structureType: BuildableStructureConstant, index:number): BuildTaskData {
        return {
            id: null,
            department: null,
            stationType: null,
            pos: pos,
            roomName: roomName,
            structureType: structureType,
            index: index,
        };
    }

    private addBuildTaskAndAdjacentRoads(buildTask: BuildTaskData): void {
        const structureType = buildTask.structureType;
        const structurePos = buildTask.pos;

        const roomPlanningMem = new RoomPlanningMem(this.roomName);

        let structureReference = -1;
        if (buildTask.index) structureReference = buildTask.index;
        else structureReference = roomPlanningMem.getStructureReference(structureType, structurePos);

        if(structureReference != -1) {
            const adjacentRoadReference = roomPlanningMem.getAdjacentRoadReference(structureType, structureReference);
            for (let i = 0; i < adjacentRoadReference.length; ++i) {
                const roadReference = adjacentRoadReference[i];
                const roadModel = roomPlanningMem.getModel(STRUCTURE_ROAD)[roadReference];
                const roadPos = roadModel.pos;
                //const roadRoomPos = new RoomPosition(roadPos[0], roadPos[1], this.roomName);
                //roadRoomPos.createConstructionSite(STRUCTURE_ROAD);

                if (!roomPlanningMem.structureTaskSent(STRUCTURE_ROAD, roadReference)) {
                    const roadBuildTask = this.createNoDptBuildTask(roadPos, this.roomName, STRUCTURE_ROAD, roadReference);
                    const level = this.buildTaskHash(roadBuildTask);
                    this.access_memory.addBuildTask(level, roadBuildTask);
                    roomPlanningMem.setStructureSendToConstruct(STRUCTURE_ROAD, roadReference);
                }
            }
        }

        const level = this.buildTaskHash(buildTask);
        this.access_memory.addBuildTask(level, buildTask);
        if (structureReference && structureReference > -1)
            roomPlanningMem.setStructureSendToConstruct(structureType, structureReference);

    }

    maintenance(): void {
        //console.log(111111111111111)
        this.removeDeadCreep();

        this.removeCompletedBuildTask();
        this.checkHighPriorityBuildTask();

        this.creepNumController();

        //console.log(this.buildTaskHash({id: null, department: null, stationType: null, pos: [0,0], roomName: "", structureType: STRUCTURE_CONTAINER, index: null}))
    }


    private buildTaskHash(buildTask: BuildTaskData):number {
        // @ts-ignore
        if (BuildStation.level0.includes(buildTask.structureType)) return 0;
        // @ts-ignore
        else if (BuildStation.level1.includes(buildTask.structureType)) return 1;
        // @ts-ignore
        else if (BuildStation.level2.includes(buildTask.structureType)) return 2;
        // @ts-ignore
        else if (BuildStation.level3.includes(buildTask.structureType)) return 3;
        else return 4;
    }

    private sendReplyOrder(structure: Structure, department: DepartmentName, stationType: StationType): void {
        const orderManager = new OrderManager(this.roomName);
        const order = {
            name: "UPDATE_BUILDING_INFO",
            data: {
                id: structure.id,
                pos: structure.pos,
                roomName: structure.room.name,

            }
        }
        orderManager.sendOrder("UPDATE_BUILDING_INFO", order.data, department, stationType);
    }


    private removeCompletedBuildTask(): void {
        let deleted = true;

        while (deleted) {
            const highPriorityBuildTask = this.access_memory.getHighPriorityBuildTask();
            if (highPriorityBuildTask) {
                const constructionSiteId = highPriorityBuildTask.id;
                if (constructionSiteId) {
                    const constructionSite = Game.getObjectById(constructionSiteId as Id<ConstructionSite>);
                    if (constructionSite) {
                        deleted = false;
                    } else {        // no construction site in this position, search if exist structure
                        const foundStructure = this.searchAndSaveCompleteStructure(highPriorityBuildTask);
                        if (!foundStructure) {
                            //this.access_memory.removeHighPriorityBuildTask();
                            highPriorityBuildTask.id = null;
                            deleted = false;
                        }
                        // deleted = true;
                    }
                } else {            // no construction id in this position, search if exist structure
                    const foundStructure =  this.searchAndSaveCompleteStructure(highPriorityBuildTask);
                    if (!foundStructure) {
                        //this.access_memory.removeHighPriorityBuildTask();
                        highPriorityBuildTask.id = null;
                        deleted = false;
                    }

                }

            } else {

                deleted = false;
            }
        }

    }

    public searchAndSaveCompleteStructure(highPriorityBuildTask: BuildTaskData) {
        const structureInfo = Game.rooms[highPriorityBuildTask.roomName].lookForAt(LOOK_STRUCTURES, highPriorityBuildTask.pos[0], highPriorityBuildTask.pos[1]);
        let structureFound = false;
        if (structureInfo.length) {
            const targetStructure = structureInfo.filter((structure) => {
                return structure.structureType == highPriorityBuildTask.structureType;
            })[0];
            if (targetStructure) {
                // send reply order
                if (highPriorityBuildTask.department) this.sendReplyOrder(targetStructure, highPriorityBuildTask.department, highPriorityBuildTask.stationType);
                const roomPlanningMem = new RoomPlanningMem(this.roomName);
                if (highPriorityBuildTask.index != null)
                    roomPlanningMem.setStructureId(highPriorityBuildTask.structureType, highPriorityBuildTask.index, targetStructure.id);
                this.access_memory.removeHighPriorityBuildTask();
                structureFound = true;
            }

        }
        return structureFound;

    }

    private checkHighPriorityBuildTask(): void {
        const highPriorityBuildTask = this.access_memory.getHighPriorityBuildTask();
        if (highPriorityBuildTask) {
            if (highPriorityBuildTask.id) {
                const constructionSite = Game.getObjectById(highPriorityBuildTask.id as Id<ConstructionSite>);
                if (!constructionSite) {
                    highPriorityBuildTask.id = null;
                }
            } else {

                const constructionSites = Game.rooms[highPriorityBuildTask.roomName].lookForAt(LOOK_CONSTRUCTION_SITES, highPriorityBuildTask.pos[0], highPriorityBuildTask.pos[1]);
                if (constructionSites.length) {
                    highPriorityBuildTask.id = constructionSites[0].id;
                }
                else {      // no construction site in this position, create one
                    const constructionSitePos = new RoomPosition(highPriorityBuildTask.pos[0], highPriorityBuildTask.pos[1], highPriorityBuildTask.roomName);
                    const r = constructionSitePos.createConstructionSite(highPriorityBuildTask.structureType);
                    if (r != OK) {
                        // TODO PRECAUTION !!!
                        console.log("create construction site failed: " + r + " " + highPriorityBuildTask.structureType + " " + highPriorityBuildTask.pos);
                        this.access_memory.removeHighPriorityBuildTask();

                    }
                }
            }
        }
    }

    private removeDeadCreep(): void {
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        for (const creepName in creepDeadTick) {
            if (creepDeadTick[creepName] && creepDeadTick[creepName] - Game.time < 0) {
                delete creepDeadTick[creepName];
                delete Memory['creeps'][creepName];
            }
        }
    }

    private creepNumHash(): number {
        const room = Game.rooms[this.roomName];
        const energyRCL = getEnergyRCL(room.energyCapacityAvailable);
        switch (energyRCL) {
            case 0: return 2;
            case 1: return 2;
            case 2: return 2;
            case 3: return 2;
            case 4: return 2;
            case 5: return 2;
            case 6: return 3;
            case 7: return 3;
            default: return 3;
        }
    }

    private getStationBodyResource(): number {
        const creepList = Object.keys(this.access_memory.getCreepDeadTick());
        let totalBodyResource = 0;
        for (let i = 0; i < creepList.length; ++i) {
            const creepName = creepList[i];
            const creep = Game.creeps[creepName];
            if (creep)
                totalBodyResource =  this.getBodyResource(creepName, "work");
        }
        return totalBodyResource;
    }

    private needMoreCreep(): boolean {

        const creepDeadTick = this.access_memory.getCreepDeadTick();
        const creepNum = Object.keys(creepDeadTick).length;

        const totalTaskCost = this.access_memory.getTotalTaskCost();



        const energyStored = this.getStoredEnergy();

        if (energyStored >= 4000*0.5) {

            if (creepNum == 0 && totalTaskCost > 0) return true;

            const totalBodyResource = this.getStationBodyResource() * 0.6 * 5;  //net + performance + weight
            return totalBodyResource < totalTaskCost;
        }

        return false

    }

    private creepNumController(): void {
        const highPriorityBuildTask = this.access_memory.getHighPriorityBuildTask();
        if (!highPriorityBuildTask) return;

        const creepDeadTick = this.access_memory.getCreepDeadTick();
        const creepNum = Object.keys(creepDeadTick).length;
        const maxCreepNum = this.creepNumHash();

        if (creepNum < maxCreepNum) {
            if (this.needMoreCreep()) this.addCreep();
        }

    }

    private addCreep(): void {
        // get no repeat creepName
        let creepName: string;
        do {
            creepName = this.getRandomName();
        } while (!this.checkCreepName(creepName));

        //get creepConfig
        const creepConfig = this.access_memory.getCreepConfig();
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        creepDeadTick[creepName] = null;

        // send creepSpawnTask
        this.sendCreepSpawnTask(creepName, creepConfig);
    }




    
}