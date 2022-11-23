
export class ExtendRoomPosition extends RoomPosition {
    // public isWalkable(): boolean {
    //     if (this.lookFor(LOOK_TERRAIN)[0] == 'wall') {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    public getAdjacentPositions(): RoomPosition[] {
        const positions: RoomPosition[] = [];
        const x = this.x;
        const y = this.y;
        const roomName = this.roomName;
        if (x > 0) {
            positions.push(new RoomPosition(x - 1, y, roomName));
        }
        if (x < 49) {
            positions.push(new RoomPosition(x + 1, y, roomName));
        }
        if (y > 0) {
            positions.push(new RoomPosition(x, y - 1, roomName));
        }
        if (y < 49) {
            positions.push(new RoomPosition(x, y + 1, roomName));
        }

        if (x > 0 && y > 0) {
            positions.push(new RoomPosition(x - 1, y - 1, roomName));
        }
        if (x < 49 && y > 0) {
            positions.push(new RoomPosition(x + 1, y - 1, roomName));
        }
        if (x > 0 && y < 49) {
            positions.push(new RoomPosition(x - 1, y + 1, roomName));
        }
        if (x < 49 && y < 49) {
            positions.push(new RoomPosition(x + 1, y + 1, roomName));
        }

        return positions;
    }

    public isWalkable(): boolean {
        if (this.lookFor(LOOK_TERRAIN)[0] == 'wall') {
            return false;
        } else {
            return true;
        }
    }

    public isWalkableAndNotOccupied(): boolean {
        if (this.isWalkable() && this.lookFor(LOOK_CREEPS).length == 0) {
            return true;
        } else {
            return false;
        }
    }

    public isWalkableAndNotOccupiedAndNotReserved(): boolean {
        if (this.isWalkableAndNotOccupied() && this.lookFor(LOOK_FLAGS).length == 0) {
            return true;
        } else {
            return false;
        }
    }

    public isWalkableAndNotOccupiedAndNotReservedAndNotReservedByCreep(): boolean {
        if (this.isWalkableAndNotOccupiedAndNotReserved() && this.lookFor(LOOK_CREEPS).length == 0) {
            return true;
        } else {
            return false;
        }
    }

    public isWalkableAndNotOccupiedAndNotReservedAndNotReservedByCreepAndNotReservedByFlag(): boolean {
        if (this.isWalkableAndNotOccupiedAndNotReservedAndNotReservedByCreep() && this.lookFor(LOOK_FLAGS).length == 0) {
            return true;
        } else {
            return false;
        }
    }
}