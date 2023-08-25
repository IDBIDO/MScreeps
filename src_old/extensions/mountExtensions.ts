import {assignPrototype} from "@/utils";
import {ExtendRoomPosition} from "@/extensions/ExtendRoomPosition";
import CreepExtension from "@/creep/mount.creep";

export default () => {
    assignPrototype(RoomPosition, ExtendRoomPosition);
    assignPrototype(Creep, CreepExtension);
}