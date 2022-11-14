import {assignPrototype} from "@/utils";
import {ExtendRoomPosition} from "@/extensions/ExtendRoomPosition";

export default () => {
    assignPrototype(RoomPosition, ExtendRoomPosition);

}