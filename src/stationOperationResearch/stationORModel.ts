export abstract class StationORModel {

    roomName: string;

    protected constructor(roomName: string) {
        this.roomName = roomName;
    }

    protected abstract creepNumController();

    protected abstract structureController();

    run() {

        this.creepNumController();
        this.structureController();
    }



}