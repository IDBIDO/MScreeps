import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import {minDistance} from "@/init_mem/computePlanning/planningUtils";

import _ from 'lodash';
import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";
import DptHarvesterMem from "@/access_mem/colonyMem/dptHarvesterMem";
import {CreepSpawningMem} from "@/access_mem/colonyMem/creepSpawningMem";


export abstract class WorkStation {

    id: string;
    roomName: string;
    type: stationType;
    orders: HarvesterWorkStationOrder[];

    creepList: creepState[];

    sourceInfo: HarvesterSourceInfo;
    targetInfo: HarvesterTargetInfo

    creepConfig:  CreepSpawnConfig;

    //distanceToSpawn:  number;
    needTransporterCreep:  boolean;
    transporterSetting?:  TransporterSetting;

    mem: {}

    protected randomID(): string {
        return Math.random().toString(36).substr(2, 9);
    }


    /********** mutator ********/

    //to create new work station
    /*
        1. give roomName
        2. give id, roomName
    */
    protected constructor(roomName: string,  id?: string) {
        this.roomName = roomName;
        if (id) {
            this.id = id;
            //let auxMem = new DptHarvesterMem('')
            //this.mem = Memory['colony'][roomName]['']['workStations'][id];
        }
        else {
            this.id = this.randomID();
            this.type = null;
            this.orders = [];
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

    public exeOrder( ) {
        let mem = this.getMemObject();
        let order = mem['orders'].shift();
        return order;
    }

    protected sendSpawnTaskx(creepName: string, creepBodyOption: string, departmentName: string, workStationId: string, priority: number) {

        let task: SpawnTask = {
            creepName: creepName,
            creepBodyOption: creepBodyOption,
            departmentName: departmentName,
            workStationId: workStationId
        }


    }

    protected sendSpawnTask(spawnTask: SpawnTask, priority: number) {
        let creepSpawningMem = new CreepSpawningMem(this.roomName);
        creepSpawningMem.addSpawnTask(spawnTask, priority);

    }

    protected executeOrders():void {
        let mem = this.getMemObject();
        let order:StationOrder = mem['orders'][0];
        if (order) {

            switch (order) {
                case "addCreep":
                    //this.addCreep();
                    break;
                case "removeCreep":
                    //this.removeCreep();
                    break;
                case "addTransporterCreep":
                    //this.addTransporter();
                    break;
                case "removeTransporterCreep":
                    //this.removeTransporter();
                    break;
                default:
                    break;
            }
        }
    }


    //to create work station from memor
    getData() {
        let mem = new DptHarvesterMem(this.sourceInfo.roomName);
        return mem.getWorkStation(this.id);
        return this.mem;
    }

    addOrder(order: WorkStationOrder) {
        this.mem['orders'].push(order);
    }




    /********** consultor ********/
    protected abstract getStationData(): HarvesterWorkStationData;

    protected getStationId(): string {
        return this.id;
    }
    /********* end of consultor ********/


    protected getDistanceToNearSpawn(pos: [number, number], roomName: string): number {
        let spawnList:modelData[] = RoomPlanningMem.getStructureList(roomName, 'spawn');
        let positionList: [number, number][] = [];
        for (let spawn of spawnList) {
            positionList.push(spawn.pos);
        }

        return minDistance(pos, positionList);
    }

    /******** setter ********/

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


    protected createTransporterSetting(needWithdraw: boolean,
                                       amount: number, resourceType: ResourceConstant): TransporterSetting {
        return {
            stationId: this.id,
            needWithdraw: needWithdraw,
            amount: amount,
            resourceType: resourceType
        };
    }
    /******** end of setter ********/

    protected sendOrder(order: Order) {

    }



}