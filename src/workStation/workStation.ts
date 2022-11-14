import RoomPlanningMem from "@/access_mem/colonyMem/roomPlanningMem";
import {minDistance} from "@/init_mem/computePlanning/planningUtils";

import _ from 'lodash';


export abstract class WorkStation {

    id: string;
    state: WorkPositionState;

    //creepList: pair(string, boolean)[];


    location: location;
    creepConfig:  CreepSpawnConfig;

    distanceToSpawn:  number;
    //canRenewCreep:  boolean;
    needTransporterCreep:  boolean;
    transporterSetting?:  TransporterSetting;

    protected constructor(pos: [number, number], roomName: string) {
        this.state = this.createWorkPositionState(false, false, '', 'dead');
        this.id = this.randomID();
        this.location = this.createLocation(roomName, pos);
        this.distanceToSpawn = this.getDistanceToNearSpawn(pos, roomName);
    }

    protected randomID(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    protected getStationData(): WorkStationData {
            return {
            //id: this.id,
            state: this.state,
            location: this.location,
            creepConfig: this.creepConfig,
            distanceToSpawn: this.distanceToSpawn,
            needTransporterCreep: this.needTransporterCreep,
            transporterSetting: this.transporterSetting
        }; }

    protected getDistanceToNearSpawn(pos: [number, number], roomName: string): number {
        let spawnList:modelData[] = RoomPlanningMem.getStructureList(roomName, 'spawn');
        let positionList: [number, number][] = [];
        for (let spawn of spawnList) {
            positionList.push(spawn.pos);
        }

        return minDistance(pos, positionList);
    }


    protected createWorkPositionState(active: boolean, occupied: boolean, creepName: string, creepState: CreepState): WorkPositionState {

        return {
            active: active,
            occupied: occupied,
            creepName: creepName,
            creepState: creepState
        };
    }

    protected createLocation(roomName: string, pos: [number, number]): location {
        return {
            roomName: roomName,
            pos: pos
        };
    }

    protected createCreepSpawnConfig(role: string, body: string[], priority: number, memory: HarvesterMemory | UpgraderMemory): CreepSpawnConfig {
        return {
            role: role,
            body: body,
            priority: priority,
            memory: memory
        };
    }

    protected createHarvesterMemory(sourceId: string, containerId?: string, linkId?: string): HarvesterMemory {
        return {
            sourceId: sourceId,
            containerId: containerId,
            linkId: linkId,

        };
    }

    protected createTransporterSetting(id: string, needWithdraw: boolean, amount: number, resourceType: ResourceConstant): TransporterSetting {
        return {
            id: id,
            needWithdraw: needWithdraw,
            amount: amount,
            resourceType: resourceType
        };
    }





}