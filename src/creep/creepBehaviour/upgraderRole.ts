import {UpgradeStationMem} from "@/access_memory/upgradeStationMem";
import harvesterRole from "@/creep/creepBehaviour/harvesterRole";

const upgraderRole:{
    [role in UpgraderRole]: () => ICreepConfig
} = {
    upgrader: (): ICreepConfig => ({
        source: (creep: Creep): boolean => {
            const upgraderStationMem = new UpgradeStationMem(creep.memory.roomName, creep.memory.workStationID as UpgraderStationType);
            const workPosEntranceRef = upgraderStationMem.getWorkPosEntrance(upgraderStationMem.getSourceInfo().type);
            const workPosEntrance = upgraderStationMem.getWorkPos(upgraderStationMem.getSourceInfo().type)[workPosEntranceRef];
            if (creep.pos.isEqualTo(workPosEntrance[0], workPosEntrance[1])) {
                return true;
            } else {
                creep.moveTo(workPosEntrance[0], workPosEntrance[1]);
            }
            return false;
        },
        target: (creep: Creep): boolean => {
            const upgraderStationMem = new UpgradeStationMem(creep.memory.roomName, creep.memory.workStationID as UpgraderStationType);
            const sourceInfo = upgraderStationMem.getSourceInfo();
            if (!sourceInfo) return false;      // no sourceInfo, do not do anything
            const source = Game.getObjectById(sourceInfo.id as Id<StructureContainer>);

            if (creep.store.getUsedCapacity() == 0) {
                const r = creep.withdraw(source, 'energy');
                if (r == ERR_NOT_IN_RANGE) {
                    return true;            //creep out of work position
                }
            } else {
                const r = creep.upgradeController(Game.rooms[creep.memory.roomName].controller as StructureController);
                if (r == ERR_NOT_IN_RANGE) {
                    //creep.moveTo(Game.rooms[creep.memory.roomName].controller as StructureController);
                    return true
                }
            }
            return false;
        }

    }),
}

export default upgraderRole;


