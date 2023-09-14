import {bodyComponentNumDefault} from "../../src_old/creep/creepBody";


export const bodyPrototype = {
    harvester: [WORK, CARRY, MOVE],
    builder: [WORK, CARRY, MOVE],
    transporter: [CARRY, MOVE],
    upgrader: [WORK, CARRY, MOVE],
    repairer: [WORK, CARRY, MOVE]
}

export const bodyProportion = {
    harvester: [2, 1, 1],
    builder: [1, 3, 1],
    transporter: [2, 1],
    upgrader: [2, 1, 1],
    repairer: [1, 2, 1]
}

export const maxBodyProportion = {
    harvester: 3,
    builder: 5,
    transporter: 10,
    upgrader: 10,
    repairer: 5
}
export const energyAvailable = [300, 550, 800, 1300, 1800, 2300, 5600, 10000]
export function getMaxSimpleBody(role: CreepRole,  roomName: string): BodyPartConstant[] {

    const bodyPrototypeModel: BodyPartConstant[] = bodyPrototype[role];
    const bodyProportionModel: number[] = bodyProportion[role];

    // get room energy capacity
    const roomEnergyCapacity = Game.rooms[roomName].energyCapacityAvailable;
    // get cost vector for body bodyPrototype
    const costVector = bodyPrototypeModel.map((bodyPart) => BODYPART_COST[bodyPart]);

    //copy bodyProportion
    let currentBodyProportion = bodyProportionModel.slice();

    // multiply cost vector by bodyProportion vector
    const costVectorMultiplied = costVector.map((cost, index) => cost * currentBodyProportion[index]);

    let sum = costVectorMultiplied.reduce((x, y) => x + y, 0);
    let add = false;
    while (sum < roomEnergyCapacity) {
        // add currentBodyProportion to bodyProportion
        currentBodyProportion = currentBodyProportion.map((value, index) => value + bodyProportionModel[index]);
        // multiply cost vector by bodyProportion vector
        const costVectorMultiplied = costVector.map((cost, index) => cost * currentBodyProportion[index]);
        sum = costVectorMultiplied.reduce((x, y) => x + y, 0);
        add = true;
    }

    // invert last map of currentBodyProportion
    if (add)
    currentBodyProportion = currentBodyProportion.map((value, index) => value - bodyProportionModel[index]);
    // compute body
    let body: BodyPartConstant[] = [];
    for (let i = 0; i < currentBodyProportion.length; ++i) {
        for (let j = 0; j < currentBodyProportion[i]; ++j) {
            body.push(bodyPrototypeModel[i]);
        }
    }
    return body;
}

// transform to bodyPart format
export function transformBodyFormat(body: BodyPartConstant[]) {
    const bodyPart: bodyPart = {};
    for (let i = 0; i < body.length; ++i) {
        if (bodyPart[body[i]]) {
            bodyPart[body[i]] += 1;
        }
        else {
            bodyPart[body[i]] = 1;
        }
    }
    return bodyPart;
}


export function getEnergyRCL(energyAmount: number): number {

    /*
    let found = false;
    let i = 0;
    while( !found && i < 8) {
        if (energyAvailable[i] > energyAmount) return i;
        ++i;
    }
    return -1;
    */
    let found = false;
    let i = 0;
    while (!found && i < 8) {
        if (energyAvailable[i] > energyAmount) return i;
        ++i;
    }
    return 8;
}

