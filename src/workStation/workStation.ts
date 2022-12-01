import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import {minDistance} from "@/init_mem/computePlanning/planningUtils";

import _ from 'lodash';
import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";
import DptHarvesterMem from "@/access_mem/colonyMem/dptHarvesterMem";
import {CreepSpawningMem} from "@/access_mem/colonyMem/creepSpawningMem";
import {CreepSpawning} from "@/creep/creepSpawning";


export abstract class WorkStation {

    id: string;
    roomName: string;
    departmentName: departmentName;

    //type: stationType;
    order: HarvesterWorkStationOrder[];

    creepList: creepState[];

    sourceInfo: HarvesterSourceInfo;
    targetInfo: HarvesterTargetInfo

    creepConfig:  CreepSpawnConfig;

    //distanceToSpawn:  number;
    needTransporterCreep:  boolean;
    transporterSetting?:  TransporterSetting;

    mem: {}

    needSubstituteCreep(): boolean {
        return this.sourceInfo.roomName != this.roomName || this.targetInfo.roomName != this.roomName;
    }

    protected randomID(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    public getID(): string {
        return this.id;
    }

    /********** mutator ********/

    //to create new work station
    /*
        1. give roomName -> create new work station
        2. give id, roomName -> load work station
    */
    protected constructor(roomName: string,  stationType?: StationType) {
        this.roomName = roomName;
        if (stationType) {
            if (stationType == 'highway') {
                this.id = 'highway_' + Game.time;
            } else {
            this.id = stationType;
            }
            //let auxMem = new DptHarvesterMem('')
            //this.mem = Memory['colony'][roomName]['']['workStations'][id];
        }
        else {
            this.id = this.randomID();
            //this.type = null;
            this.order = [];
            this.creepList = [];

            this.sourceInfo = null;
            this.targetInfo = null;
            this.creepConfig = null;

            /*
            if (pos && roomName) {
                this.distanceToSpawn = this.getDistanceToNearSpawn(pos, roomName);
            }
            else {
                this.distanceToSpawn = 0;
            }
            */
            this.needTransporterCreep = false;
            this.transporterSetting = undefined;
        }
    }

    protected abstract getMemObject(): object;



    protected sendSpawnTask(spawnTask: SpawnTask, priority: number) {
        let creepSpawningMem = new CreepSpawningMem(this.roomName);
        creepSpawningMem.addSpawnTask(spawnTask, priority);

    }

    protected getFreeWorkPosition(): [number, number] {
        let workPositionList:[number, number, number][] = this.getMemObject()['workPosition'];

        //find the first free work position
        for (let workPosition of workPositionList) {
            if (workPosition[2] == 0) {
                return [workPosition[0], workPosition[1]];
            }
        }
    }

    protected setWorkPosition(workPos: [number, number]) {
        let workPositionList:[number, number, number][] = this.getMemObject()['workPosition'];
        for (let workPosition of workPositionList) {
            if (workPosition[0] == workPos[0] && workPosition[1] == workPos[1]) {
                workPosition[2] = 1;
            }
        }
    }
    protected unSetWorkPosition(workPos: [number, number]) {
        let workPositionList:[number, number, number][] = this.getMemObject()['workPosition'];
        for (let workPosition of workPositionList) {
            if (workPosition[0] == workPos[0] && workPosition[1] == workPos[1]) {
                workPosition[2] = 0;
            }
        }
    }

    protected addCreep() {

        //generate random creep name
        let creepName = this.id + '_' + Math.random().toString(36).substr(2, 7).toUpperCase();
        let workPosition = this.getFreeWorkPosition();
        this.setWorkPosition(workPosition);

        let creepState: creepState = {
            creepName: creepName,
            deadTick: 0,
            workPosition: workPosition,
            workRoomName: this.roomName,
            transporterCreepName: null,
            transporterDeadTick: 0
        }
        if (this.needSubstituteCreep()) {
            creepState.substituteCreepName = null;
            creepState.substituteDeadTick= 0
        }


        let stationData = this.getMemObject();
        stationData['creepList'].push(creepState);
        console.log('[' + this.departmentName + ', '+ this.roomName + '] Work station '+ this.id +' add creep, now creep list size is ' + stationData['creepList'].length);
    }
    protected removeCreep() {
        let creepState = this.creepList.shift();
        this.unSetWorkPosition(creepState.workPosition);
        console.log('[' + this.departmentName + ', '+ this.roomName + '] Work station '+ this.id +' remove creep, now creep list size is ' + this.creepList.length);
    }

    protected setTransporterCreep() {
        let mem = this.getMemObject();
        mem['needTransporterCreep'] = true;
        console.log('[' + this.departmentName + ', '+ this.roomName + '] Work station '+ this.id +' set transporter creep');
    }

    protected unSetTransporterCreep() {
        let mem = this.getMemObject();
        mem['needTransporterCreep'] = false;
        console.log('[' + this.departmentName + ', '+ this.roomName + '] Work station '+ this.id +' unset transporter creep');
    }


    public executeOrder():void {
        let mem = this.getMemObject();
        let order: WorkStationOrder = mem['order'][0];
        if (order) {

            switch (order) {
                case "ADD_CREEP":
                    this.addCreep();
                    break;
                case "DELETE_CREEP":
                    this.removeCreep();
                    break;
                case "SET_TRANSPORTER_CREEP":
                    this.setTransporterCreep();
                    break;
                case "UNSET_TRANSPORTER_CREEP":
                    this.unSetTransporterCreep();
                    break;
                default:
                    break;
            }
            mem['order'].shift();

        }
    }


    addOrder(order: WorkStationOrder) {
        let mem = this.getMemObject();
        mem['order'].push(order);
        console.log('Work station '+ this.id +' add order: ' + order);
    }




    /********** consultor ********/
    protected abstract getStationData(): HarvesterWorkStationData;
    protected getStationId(): string {
        return this.id;
    }


    protected getDistanceToNearSpawn(pos: [number, number], roomName: string): number {
        let spawnList:modelData[] = RoomPlanningMem.getStructureList(roomName, 'spawn');
        let positionList: [number, number][] = [];
        for (let spawn of spawnList) {
            positionList.push(spawn.pos);
        }

        return minDistance(pos, positionList);
    }


    /*
    protected  createSourceInfo(sourceId: string, roomName: string, pos: [number, number]): HarvesterSourceInfo {
        return {
            sourceId: sourceId,
            roomName: roomName,
            pos: pos
        };
    }
    protected createTargetInfo(targetId: string, roomName: string, pos: [number, number]): HarvesterTargetInfo {
        return {
            targetId: targetId,
            roomName: roomName,
            pos: pos
        };
    }
    protected createCreepSpawnConfig(role: string, option: 'default'|'manual', priority: number, memory:BasicMemory): CreepSpawnConfig {
        return {
            body: option,
            priority: priority,
            memory: memory
        };
    }
    protected createTransporterSetting(needWithdraw: boolean, amount: number, resourceType: ResourceConstant): TransporterSetting {
        return {
            stationId: this.id,
            needWithdraw: needWithdraw,
            amount: amount,
            resourceType: resourceType
        };
    }
    */

    protected abstract getCreepTask(): CreepTask;

    public sendCreepSpawnTask (creepName: string, department: departmentName, workStationId: string, creepIndex: number) {
        let creepSpawning = new CreepSpawning(this.roomName);

        creepSpawning.addSpawnTask({
            creepName: creepName,
            departmentName: department,
            workStationId: workStationId,
            creepIndex: creepIndex,
            creepTask: this.getCreepTask(),
        });

    }

    protected renewCreeps(): void {
        let mem = this.getMemObject();
        let creepList: creepState[] = mem['creepList'];
        for (let creepState of creepList) {
            if (creepState.deadTick != null)
                if (creepState.deadTick <= Game.time) {
                    this.sendCreepSpawnTask(creepState.creepName, this.departmentName, this.id, creepList.indexOf(creepState));
                    creepState.deadTick = null;
                }
        }
    }

    /******** end of setter ********/

    public run(): void {
        this.executeOrder();
        this.renewCreeps();
    }




}