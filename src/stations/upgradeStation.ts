import {Station} from "@/stations/station";
import {LogisticStationMem} from "@/access_memory/logisticStationMem";
import {UpgradeStationMem} from "@/access_memory/upgradeStationMem";
import {OrderManager} from "@/orderManager";

export class UpgradeStation extends Station{

    access_memory: UpgradeStationMem;

    constructor(roomName: string, stationType: UpgradeStationType) {
        super(roomName, stationType);
        this.access_memory = new UpgradeStationMem(roomName, stationType);
        this.rootObject = Memory['colony'][roomName]['dpt_upgrade'][stationType];
    }

    executeOrder(): void {
        const orderList = this.access_memory.getOrder();
        const order = orderList[0];
        if (order) {
            switch (order.name) {
                case 'ADD_CREEP':
                    this.addCreep();
                    break;
                case 'REMOVE_CREEP':
                    this.removeCreep(order.data as {creepName: string});
                    break;
                case 'UPDATE_BUILDING_INFO':
                    this.updateBuildingInfo(order.data as ID_Room_position);
                    break;
                case 'SEARCH_BUILDING_TASK':
                    this.searchBuildingTask();
                    break;
                case 'UPDATE_CREEP_NUM':
                    //this.updateCreepNum();
                    break;
                case "UPDATE_CREEP_BODY":
                    //this.updateCreepBody();
                    const creepConfig = this.access_memory.getCreepConfig();
                    creepConfig.body = this.getCurrentBodyConfig();
                    break;
                default:
                    break;

            }
            this.access_memory.removeOrder();

        }
    }

    private removeCreep(data: {creepName: string}): void {
        // remove creepDeadTick
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        delete creepDeadTick[data.creepName];
    }

    private addCreep(): string {
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
        return creepName;
    }

    private updateBuildingInfo(data: ID_Room_position): void {
        const dataObject = Game.getObjectById(data.id as Id<StructureContainer> | Id<StructureLink> | Id<StructureTerminal>);
        if (dataObject) {
            this.access_memory.updateSourceInfo(data.id, data.pos, data.roomName, dataObject.structureType);

        }
    }

    private searchBuildingTask(): void {
        const currentStructureInfo = this.access_memory.getSourceInfo();
        const orderManage = new OrderManager(this.roomName);
        if (currentStructureInfo.type == null) {
            const buildTaskData: BuildTaskData = {
                id: null,
                department: 'dpt_upgrade',
                stationType: 'internal_upgrade',
                pos: this.access_memory.getContainerPos(this.roomName),
                roomName: this.roomName,
                structureType: 'container',
                index: this.access_memory.getContainerReference(this.roomName),
            }
            orderManage.sendOrder('ADD_BUILD_TASK', buildTaskData, 'dpt_build', 'internal_build');
        } else if (currentStructureInfo.type == 'container') {
            if (Game.rooms[this.roomName].controller.level >= 7) {
                const buildTaskData: BuildTaskData = {
                    id: null,
                    department: 'dpt_upgrade',
                    stationType: 'internal_upgrade',
                    pos: this.access_memory.getLinkPos(this.roomName),
                    roomName: this.roomName,
                    structureType: 'link',
                    index: this.access_memory.getLinkReference(this.roomName),
                }
                orderManage.sendOrder('ADD_BUILD_TASK', buildTaskData, 'dpt_build', 'internal_build');
            }
        }
    }

    maintenance(): void {
        this.removeDeadCreep();
        this.checkCreepWorkPos();
        this.checkLevelUp();
        this.sendNewLevelOrder();
        this.creepNumControl();
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

    private creepNumControl(): void {

        if (Game.time% 101 != 0) return
        const sourceInfo = this.access_memory.getSourceInfo();
        if(sourceInfo.type == null) return;

        // if creepNum < 1 and downGradeRate < 0.5, add creep
        const creepDeadTick = this.access_memory.getCreepDeadTick();
        const controllerDownGradeRate = Game.rooms[this.roomName].controller.ticksToDowngrade /  CONTROLLER_DOWNGRADE[Game.rooms[this.roomName].controller.level];
        if (controllerDownGradeRate < 0.5 && Object.keys(creepDeadTick).length == 0) {
            this.addCreep();
        }


        if (Game.rooms[this.roomName].controller.level < 8) {
            if (sourceInfo.type == 'link') {
                const linkWorkPos = this.access_memory.getWorkPos('link');
                if (Object.keys(creepDeadTick).length < linkWorkPos.length) {
                    this.addCreep();
                }

            }
            else if (sourceInfo.type == 'container') {
                if (Game.time%2 == 0) return;
                const container = Game.getObjectById(sourceInfo.id as Id<StructureContainer>).store;
                const containerWorkPos = this.access_memory.getWorkPos('container');
                if (container.getUsedCapacity() > 1500) {
                    if (Object.keys(creepDeadTick).length < containerWorkPos.length) {
                        this.addCreep();
                    }
                }
            }

        }

    }


    private sendNewLevelOrder(): void {
        if (this.access_memory.isLevelUp()) {
            const orderManager = new OrderManager(this.roomName);
            orderManager.sendIniOrder();
        }
    }

    private checkLevelUp(): void {
        const currentRCL = this.access_memory.getCurrentRCL();
        const newRCL = Game.rooms[this.roomName].controller.level;
        if (currentRCL != newRCL) {
            this.access_memory.updateCurrentRCL();
            this.access_memory.updateLevelUp(true);
        }
    }

    private allCreepCanMove(): boolean {

        const creepDeadTick = this.access_memory.getCreepDeadTick();
        for(let creepName in creepDeadTick) {
            const creep = Game.creeps[creepName];
            if (creep) {
                if (creep.fatigue > 0) return false;
            }
        }
        return true;
    }

    private moveCreepInPath(sourceType: 'container' | 'link') {
        const rothPath = this.access_memory.getWorkPosPath(sourceType);
        const workPos = this.access_memory.getWorkPos(sourceType);
        for (let i = 0; i < rothPath.length; ++i) {
           // find creep in workPos[i]
            const creep = Game.rooms[this.roomName].lookForAt(LOOK_CREEPS, workPos[i][0], workPos[i][1])[0];
            if (creep && creep.memory.role == 'upgrader') {

                creep.move(rothPath[i] as DirectionConstant);

            }
        }


    }

    private checkCreepWorkPos(): void {
        const sourceType = this.access_memory.getSourceInfo().type;
        if (sourceType == null) return;

        // check entrance position not occupied
        const entrancePos = this.access_memory.getWorkPosEntrance(sourceType);
        const creep = Game.rooms[this.roomName].lookForAt(LOOK_CREEPS, entrancePos[0], entrancePos[1])[0];
        if (creep) {
            if (this.allCreepCanMove()) {
                this.moveCreepInPath(sourceType);
            }
        }
    }




}