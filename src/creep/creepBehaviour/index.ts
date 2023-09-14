import harvesterRoles from './harvesterRole';
import transporterRole  from "@/creep/creepBehaviour/transporterRole";
import builderRole from './builderRole'
import upgraderRole from './upgraderRole'

const creepWork: CreepWork = {
    repairer(): ICreepConfig {
        return undefined;
    },
    ...upgraderRole,
    ...harvesterRoles,

    ...transporterRole,
    ...builderRole,


}



export default creepWork;