const builderRole:{
    [role in BuilderRole]: (data: {}) => ICreepConfig
} = {
    builder: (data: BuilderTaskData): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            creep.say("I'm builder")
            return false;
        },
        target: (creep: Creep): boolean => {
            return false;
        }
    }),
    supporter: (data: BuilderTaskData): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            return false;
        },
        target: (creep: Creep): boolean => {
            return false;
        }
    })

}
export default builderRole;