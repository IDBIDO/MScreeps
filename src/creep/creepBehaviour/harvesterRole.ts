


const harvesterRole:{
    [role in HarvesterRoleConstant]: (data: {}) => ICreepConfig
} = {
    initializer: (data: CreepTask): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            if (creep.harvest(Game.getObjectById(data.sourceInfo.id as Id<Source>)) === ERR_NOT_IN_RANGE) {
                const pos = new RoomPosition(data.workPosition.pos[0], data.workPosition.pos[1], data.workPosition.roomName);
                console.log(pos)
                creep.moveTo(pos);
            }

            return false;
        },
        target: (creep: Creep): boolean => {
            return true;
        }
    }),
    harvester: (data: HarvesterCreepData): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            return true;
        },
        target: (creep: Creep): boolean => {
            return true;
        }
    })

}
export default harvesterRole;

