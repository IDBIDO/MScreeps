export const energyAvailable = [300, 550, 800, 1300, 1800, 2300, 5600, 10000]



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

export function getBody(role: string, rcl: number, bodyMode: string): BodyPartConstant[] {

    let prototype: BodyPartConstant[] = bodyPrototype[role];

    let act: BodyPartConstant[] = [];

    if (bodyMode == 'default') {
        const componentNum = bodyComponentNumDefault[role][rcl];

        for (let i in prototype) {
            for (let j = 0; j < componentNum[i]; ++j) {
                act.push(prototype[i]);
            }
        }
    }
    else if (bodyMode == 'manual') {
        const componentNumManual = bodyComponentNumManual[role][rcl];
        for (let i in prototype) {
            for (let j = 0; j < componentNumManual[i]; ++j) {
                act.push(prototype[i]);
            }
        }
    }

    return act;
}



export function ticksToSpawn(role: string, rcl: number): number {
    const componentNum:number[] = bodyComponentNumDefault[role][rcl.toString()];
    const ticks:number = componentNum.reduce((x, y) => x + y, 0)
    return ticks*3
}



export const bodyPrototype = {
    harvester: [WORK, CARRY, MOVE],
    initializer: [WORK, CARRY, MOVE],
    worker: [WORK, CARRY, MOVE],
    builder: [WORK, CARRY, MOVE],
    supporter:[WORK, CARRY, MOVE],
    transporter: [CARRY, MOVE],
    upgrader: [WORK, CARRY, MOVE],
}

export const bodyComponentNumManual = {
    harvester: [1, 1, 1, 1, 1, 1, 1, 1],

}

//default body component number
export const bodyComponentNumDefault = {
    //WORK  CARRY   MOVE
    harvester: {

        1: [2, 1, 1],
        2: [3, 1, 2],
        3: [4, 1, 2],
        4: [6, 2, 2],
        5: [6, 2, 3],
        6: [6, 4, 3],
        7: [6, 6, 3],
        8: [6, 6, 3],

    },

    transporter: {
        1: [3, 3],
        2: [6, 3],
        3: [6, 3],
        4: [6, 3],
        5: [6, 3],
        6: [10, 5],
    },

    initializer: {
        1: [2, 1, 1],
    },

    builder: {
        1: [1, 3, 1],
        2: [1, 3, 1],
    }


}