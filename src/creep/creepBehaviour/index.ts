import harvesterRoles from './harvesterRole';
import transporterRole  from "@/creep/creepBehaviour/transporterRole";

const creepWork: CreepWork = {
    ...harvesterRoles,
    ...transporterRole
    // ...workerRoles
}


export default creepWork;