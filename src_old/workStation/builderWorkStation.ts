import {WorkStation} from "@/workStation/workStation";
import ColonyMem from "@/access_mem/colonyMem";
import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";

export class BuilderWorkStation extends WorkStation {

    order: BuilderWorkStationOrder [];

    addConstructionSiteList: AddConstructionSideData[];

    checkConstructionSideList: CheckConstructionSideData[];
    toRemoveCreepList: CreepDeadTick;


    constructor(roomName: string, id: StationType) {
        super(roomName, id);
        this.departmentName = 'dpt_build';
    }

    /****************** INITIALIZATION ******************/
    protected getMemObject(): BuilderStationMemory {
        const colonyMem = new ColonyMem(this.roomName);
        return colonyMem.getWorkStationMem(this.departmentName, this.id as StationType);
    }
    private getCurrentData(): BuilderStationMemory {
        return {
            order: this.order,
            creepDeadTick: this.creepDeadTick,
            creepConfig: this.creepConfig,
            addConstructionSiteList: this.addConstructionSiteList,

            checkConstructionSideList: this.checkConstructionSideList,

            toRemoveCreepList: this.toRemoveCreepList,
        }
    }
    private initialize() {
        this.order = [];
        this.creepDeadTick = {};
        let bodyType: 'default' | 'big' = 'default';
        let priority: number = 2;

        this.creepConfig = {
            body: bodyType,
            priority: priority,
            creepMemory: {
                role: 'builder',
                taskData: {
                    constructionSiteInfo:{
                        id: null,
                        pos: null,
                        roomName: null,
                    },
                    transportTaskSent: false,
                },

                working:  false,
                ready:  false,
                dontPullMe: false,

                workStationID:  this.id,
                departmentName:  this.departmentName,
                roomName:  this.roomName,
            }
        };
        this.addConstructionSiteList = [];
        this.checkConstructionSideList = [];
        this.toRemoveCreepList = {};
    }
    private saveToMemory() {
        const colonyMem = new ColonyMem(this.roomName);
        const r = colonyMem.addWorkStation(this.departmentName, this.id as StationType, this.getCurrentData());
        if (r) console.log('builderWorkStation saved to memory');
        else console.log('ERROR: Builder WS '+ this.id +' save to memory FAILED! STATION ALREADY EXISTS')
    }

    public initializeAndSave() {
        this.initialize();
        this.saveToMemory();
    }

    /****************** ORDER ******************/
    private addCreep() {
        const creepName = this.getRandomName();
        const mem = this.getMemObject();
        mem.creepDeadTick[creepName] = 0;
        console.log('[' + this.departmentName + ', '+ this.roomName + '] Work station '+ this.id +
            ' add creep, now creep list size is ' + Object.keys(mem['creepDeadTick']).length);
    }

    private removeCreep() {
        const mem = this.getMemObject();
        const aux = Object.keys(mem.creepDeadTick);
        const creepName = aux[aux.length - 1];
        if(creepName) {
            mem.toRemoveCreepList[creepName] = mem.creepDeadTick[creepName];
            delete mem.creepDeadTick[creepName];
            console.log('[' + this.departmentName + ', '+ this.roomName + '] Work station '+ this.id +
                ' delete creep, now creep list size is ' + mem['creepDeadTick'].length);
        }
        else {
            console.log('ERROR: deleteCreep() in logisticWorkStation.ts, creepName is null');
        }
    }

    private addConstructionSite(data: AddConstructionSideData) {
        /*
        type: string;
        index: number;
        pos: [number, number];
        roomName: string;
        added: boolean;
         */
        const mem = this.getMemObject();
        //mem.constructionSiteList[data['id']] = data;
        mem.addConstructionSiteList.push(data);
        // console.log format: [roomName, workStationID] add construction site: type
        console.log('[' + this.roomName + ', '+ this.id + '] add construction site: ' + data['type']);
    }

    private deleteConstructionSite(cc) {

    }

    protected executeOrder(): void {
        const mem = this.getMemObject();
        const order = mem.order[0]
        if (order) {
            switch (order.name) {
                case "ADD_CREEP":
                    this.addCreep();
                    break;
                case "DELETE_CREEP":
                    this.removeCreep();
                    break;
                case "ADD_CONSTRUCTION_SITE":
                    this.addConstructionSite(order.data as AddConstructionSideData);
                    break;
                case "DELETE_CONSTRUCTION_SITE":
                    this.deleteConstructionSite(order.data);
                    break;
                default:
                    break;
            }
            mem['order'].shift();
        }
    }
    private removeDeleteCreep() {
        const mem = this.getMemObject();
        for (let creepName in mem.toRemoveCreepList) {
            if(mem.toRemoveCreepList[creepName] < Game.time) {
                delete mem.toRemoveCreepList[creepName];
            }
        }
    }

    private addConstructionSide() {
        const mem = this.getMemObject();
        const addConstructionSide = mem.addConstructionSiteList;
        for (let construction of addConstructionSide) {
            // pop
            //addConstructionSide.shift();
            if (!construction.added) {

                const roomPos = new RoomPosition(construction.pos[0], construction.pos[1], construction.roomName);
                const rValue = roomPos.createConstructionSite(construction.type as BuildableStructureConstant);
                if (rValue == 0) construction.added = true;

            }
        }
    }

    private saveAddedConstructionSide() {
        const mem = this.getMemObject();
        const addConstructionSide = mem.addConstructionSiteList;
        for (let construction of addConstructionSide) {
            if (construction.added) {
                const roomPos = new RoomPosition(construction.pos[0], construction.pos[1], construction.roomName);
                const constructionSideList = roomPos.lookFor(LOOK_CONSTRUCTION_SITES);
                if (constructionSideList.length > 0) {
                    const checkConstructionSideList = mem.checkConstructionSideList;
                    const checkConstructionSide: CheckConstructionSideData = {
                        id: constructionSideList[0].id,
                        index: construction.index,
                        type: construction.type,
                    }
                    checkConstructionSideList.push(checkConstructionSide);
                    // print checkConstructionSide atributes
                    //console.log('checkConstructionSide: ' + JSON.stringify(checkConstructionSide));
                }

                const index = addConstructionSide.indexOf(construction);
                if (index > -1) { // only splice array when item is found
                    addConstructionSide.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
        }
    }

    private checkConstructionComplete() {
        const mem = this.getMemObject();
        const checkConstructionSideList = mem.checkConstructionSideList;

        for (let i = 0; i < checkConstructionSideList.length; ++i) {
            const constructionInfo = checkConstructionSideList[i];
            const construction = Game.getObjectById(constructionInfo.id as Id<ConstructionSite>)
            if (!construction) {
                const planningMem = new RoomPlanningMem(this.roomName);
                planningMem.addStructureInfo(constructionInfo.type, constructionInfo.index, constructionInfo.id);
                checkConstructionSideList.splice(i, 1);
            }
        }
    }

    protected maintenance(): void {
        this.removeDeleteCreep();
        this.renewCreeps();

        this.addConstructionSide();
        this.saveAddedConstructionSide();
        this.checkConstructionComplete();

    }



}