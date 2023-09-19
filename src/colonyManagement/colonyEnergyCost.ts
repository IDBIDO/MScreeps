import {HarvestStationMem} from "@/access_memory/harvestStationMem";
import {LogisticStationMem} from "@/access_memory/logisticStationMem";
import {BuildStationMem} from "@/access_memory/buildStationMem";
import {UpgradeStationMem} from "@/access_memory/upgradeStationMem";
import {max, min} from "lodash";


export function getCreepCost(creepBodyPart: bodyPart) {
    let cost = 0;
    const bodyNames = Object.keys(creepBodyPart);
    for (let bodyName of bodyNames) {
        cost += BODYPART_COST[bodyName];
    }
    return cost;
}

export const workCreepConsumption = {
    'builder': 5,
    'repairer': 1,
    'upgrader': 1,
}

export function getCreepCostPerTick(creepBodyPart: bodyPart, creepRole: CreepRole) {

    if (creepRole == 'builder' || creepRole == 'repairer' || creepRole == 'upgrader') {
        //console.log(creepRole)
        //console.log((getCreepCost(creepBodyPart) / 1500) + workCreepConsumption[creepRole]*creepBodyPart.work)
        return (getCreepCost(creepBodyPart) / 1500) + workCreepConsumption[creepRole]*creepBodyPart.work;
    } else {
        return getCreepCost(creepBodyPart) / 1500;
    }
}

export function getDptHarvestCreepEnergyCost(roomName: string) {
    const harvestMem = Memory['colony'][roomName]['dpt_harvest'];
    const stationNames = Object.keys(harvestMem);
    let cost = 0;
    for (let stationName of stationNames) {
        const harvestStationMem = new HarvestStationMem(roomName, stationName as HarvestStationType);
        const creepDeadTick = harvestStationMem.getCreepDeadTick();
        const creepNum = Object.keys(creepDeadTick).length;
        cost += creepNum * getCreepCostPerTick(harvestStationMem.getCreepConfig().body, harvestStationMem.getCreepConfig().creepMemory.role);
    }
    return cost;
}

export function getDptLogisticCreepEnergyCost(roomName: string) {
    const logisticMem = Memory['colony'][roomName]['dpt_logistic'];
    const stationNames = Object.keys(logisticMem);
    let cost = 0;
    for (let stationName of stationNames) {
        const logisticStationMem = new LogisticStationMem(roomName, stationName as LogisticStationType);
        const creepDeadTick = logisticStationMem.getCreepDeadTick();
        const creepNum = Object.keys(creepDeadTick).length;
        cost += creepNum * getCreepCostPerTick(logisticStationMem.getCreepConfig().body, logisticStationMem.getCreepConfig().creepMemory.role);
    }
    return cost;
}

export function getDptBuildCreepEnergyCost(roomName: string) {
    const buildMem = Memory['colony'][roomName]['dpt_build'];
    const stationNames = Object.keys(buildMem);
    let cost = 0;
    for (let stationName of stationNames) {
        const buildStationMem = new BuildStationMem(roomName, stationName as BuildStationType);
        const creepDeadTick = buildStationMem.getCreepDeadTick();
        const creepNum = Object.keys(creepDeadTick).length;
        cost += creepNum * getCreepCostPerTick(buildStationMem.getCreepConfig().body, buildStationMem.getCreepConfig().creepMemory.role);
    }
    return cost;
}

export function getDptUpgradeCreepEnergyCost(roomName: string) {
    const upgradeMem = Memory['colony'][roomName]['dpt_upgrade'];
    const stationNames = Object.keys(upgradeMem);
    let cost = 0;
    for (let stationName of stationNames) {
        const upgradeStationMem = new UpgradeStationMem(roomName, stationName as UpgradeStationType);
        const creepDeadTick = upgradeStationMem.getCreepDeadTick();
        const creepNum = Object.keys(creepDeadTick).length;
        cost += creepNum * getCreepCostPerTick(upgradeStationMem.getCreepConfig().body, upgradeStationMem.getCreepConfig().creepMemory.role);
    }
    //console.log(cost)
    return cost;
}


export function getColonyCreepCostPerTick(roomName: string) {
    return getDptHarvestCreepEnergyCost(roomName) + getDptLogisticCreepEnergyCost(roomName) +
        getDptBuildCreepEnergyCost(roomName) + getDptUpgradeCreepEnergyCost(roomName);
}

export const energyTransferLost = 0.05;
export const energyHarvestLost = 0.10;
export function getHarvestStationWorkBody(roomName: string, harvestStationType: HarvestStationType) {
    const harvestStationMem = new HarvestStationMem(roomName, harvestStationType);
    const creepConfig = harvestStationMem.getCreepConfig();
    const creepDeadTick = harvestStationMem.getCreepDeadTick();
    const creepNum = Object.keys(creepDeadTick).length;
    return creepConfig.body.work*creepNum;
}

export function getColonyEnergyHarvestPerTick(roomName: string) {
    const harvestMem = Memory['colony'][roomName]['dpt_harvest'];
    const stationNames = Object.keys(harvestMem);
    let energy = 0;
    for (let stationName of stationNames) {
        const harvestStationMem = new HarvestStationMem(roomName, stationName as HarvestStationType);
        const sourceInfo = harvestStationMem.getUsage().sourceInfo;
        let sourceEnergy = 1500;
        if (sourceInfo.roomName != roomName) {
            const roomObject = Game.rooms[sourceInfo.roomName];
            if (roomObject && roomObject.controller && roomObject.controller.my) {
                sourceEnergy += 1500;
            }
        } else {
            sourceEnergy += 1500;
        }
        sourceEnergy /= 300;
        energy += min([getHarvestStationWorkBody(roomName, stationName as HarvestStationType)*2*(1-energyHarvestLost)*(1-energyTransferLost), sourceEnergy]);

    }
    return energy;
}