import harvesterRoles from './harvesterRole';
import transporterRole  from "@/creep/creepBehaviour/transporterRole";
import builderRole from './builderRole'

const creepWork: CreepWork = {
    builder(): ICreepConfig {
        return undefined;
    }, repairer(): ICreepConfig {
        return undefined;
    },
    ...harvesterRoles,

    ...transporterRole,
    //...builderRole,


}



export default creepWork;