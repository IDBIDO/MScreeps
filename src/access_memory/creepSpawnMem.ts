export class CreepSpawnMem {
    roomName: string;
    rootMem: {};
    constructor(roomName: string) {
        this.roomName = roomName;
        this.rootMem = Memory['colony'][roomName]['creepSpawning'];
    }

    /***************** CONSULTER *****************/

    private getBody(bodyModel: bodyPart): BodyPartConstant[] {

        //let prototype: BodyPartConstant[] = bodyPrototype[bodyModel.role];

        let act: BodyPartConstant[] = [];

        // bodyModel is a dictionary where the keys are the body part and the values are the number of that body part
        // use the key to get the body part and the value to get the number of that body part
        for (let i in bodyModel) {
            // convert i to a BodyPartConstant
            let bodyPart: BodyPartConstant = i as BodyPartConstant;
            // get the number of that body part
            let num: number = bodyModel[i];
            // add the body part to the body
            for (let j = 0; j < num; ++j) {
                act.push(bodyPart);
            }
        }


        return act;

    }

    // get highest priority spawnTask
    getSpawnTask(): {creepName: string, creepBody: BodyPartConstant[], creepMemory: CreepMemory} {
        //return this.rootMem['spawnTask'];
        for (let priority in this.rootMem['spawnTask']) {
            if (Object.keys(this.rootMem['spawnTask'][priority]).length > 0) {
                //return this.rootMem['spawnTask'][priority];
                // return the first element in the object
                for (let creepName in this.rootMem['spawnTask'][priority]) {
                    const bodyModel = this.rootMem['spawnTask'][priority][creepName]['body'];
                    return {
                        creepName: creepName,
                        creepBody: this.getBody(bodyModel),
                        creepMemory: this.rootMem['spawnTask'][priority][creepName]['creepMemory'],
                    }
                }
            }
        }
        return null;

    }

    removeSpawnTask(creepName: string): void {
        for (let priority in this.rootMem['spawnTask']) {
            if (this.rootMem['spawnTask'][priority][creepName]) {
                delete this.rootMem['spawnTask'][priority][creepName];
                break;
            }
        }
    }


    getSpawnID(): string[] {
        return this.rootMem['spawnId'];
    }

    /***************** SETTER *****************/
    addSpawnID(spawnID: string): void {
        this.rootMem['spawnId'].push(spawnID);
    }

    removeSpawnID(spawnID: string): void {
        const index = this.rootMem['spawnID'].indexOf(spawnID);
        if (index > -1) {
            this.rootMem['spawnId'].splice(index, 1);
        }
    }

    addSpawnTask(creepName: string, creepSpawnConfig: CreepSpawnConfig): void {

        const priority = creepSpawnConfig.priority;
        this.rootMem['spawnTask'][priority][creepName] = {
            body: creepSpawnConfig.body,
            creepMemory: creepSpawnConfig.creepMemory,
        };
    }



    getOrderList(): {name: GeneralOrder, data: {}}[] {
        return this.rootMem['order'];
    }

    // get first order in the list but do not delete it
    getOrder(): {name: GeneralOrder, data: {}} {
        return this.rootMem['order'][0];
    }

    // delete the first order in the list
    removeOrder(): void {
        this.rootMem['order'].shift();
    }

}

export class creepSpawnMem {
}