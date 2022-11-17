import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import {minDistance} from "@/init_mem/computePlanning/planningUtils";

import _ from 'lodash';
import {HarvesterWorkStation} from "@/workStation/harvesterWorkStation";


export abstract class WorkStation {

    id: string;
    type: stationType;
    orders: HarvesterWorkStationOrder[];

    creepList: creepState[];

    sourceInfo: HarvesterSourceInfo;
    targetInfo: HarvesterTargetInfo

    creepConfig:  CreepSpawnConfig;

    distanceToSpawn:  number;
    needTransporterCreep:  boolean;
    transporterSetting?:  TransporterSetting;

    protected randomID(): string {
        return Math.random().toString(36).substr(2, 9);
    }


    /********** mutator ********/

    //to create new work station
    protected constructor(id?: string, pos?: [number, number], roomName?: string) {

        if (id) {
            this.id = id;
        }
        else {
            this.id = this.randomID();
            this.type = null;
            this.orders = [];
            this.creepList = [];

            this.sourceInfo = null;
            this.targetInfo = null;
            this.creepConfig = null;

            if (pos && roomName) {
                this.distanceToSpawn = this.getDistanceToNearSpawn(pos, roomName);
            }
            else {
                this.distanceToSpawn = 0;
            }

            this.needTransporterCreep = false;
            this.transporterSetting = undefined;
        }
    }


    /********** consultor ********/
    protected getStationData(): WorkStationData {
            return {
            type: this.type,
            orders: this.orders,

            creepList: this.creepList,

            sourceInfo: this.sourceInfo,
            targetInfo: this.targetInfo,

            creepConfig: this.creepConfig,

            distanceToSpawn: this.distanceToSpawn,
            needTransporterCreep: this.needTransporterCreep,
            transporterSetting: this.transporterSetting
        };
    }

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


    protected createCreepSpawnConfig(role: string, option: number, priority: number, memory:BasicMemory): CreepSpawnConfig {
        return {
            role: role,
            body: option,
            priority: priority,
            memory: memory
        };
    }


    protected createTransporterSetting(id: string, needWithdraw: boolean,
                                       amount: number, resourceType: ResourceConstant): TransporterSetting {
        return {
            id: id,
            needWithdraw: needWithdraw,
            amount: amount,
            resourceType: resourceType
        };
    }
    /******** end of setter ********/

    protected abstract executeOrders(): void;



}