import ColonyMem from "@/access_mem/colonyMem";

export class ColonyStatus {

    //location param
    roomName: string;

    buildRCL: number;
    fase: number;
    operationResearchState: boolean;  // false = not started, true = started

    storageID: string;


    constructor(roomName: string) {
        this.roomName = roomName;
    }

    /********************** INITIALIZE *************************/
    public getMemObject(): ColonyStatusMemory {
        const colonyMem = new ColonyMem(this.roomName);
        return colonyMem.getColonyStatusMem();
    }

    private getCurrentData(): ColonyStatusMemory {
        return {
            buildRCL: this.buildRCL,
            fase: this.fase,
            operationResearchState: this.operationResearchState,
            storageID: this.storageID,
        }
    }
    private initialize() {
        this.buildRCL = 0;
        this.fase = 0;
        this.storageID = '';
        this.operationResearchState = false;
    }

    private saveToMemory() {
        const colonyMem = new ColonyMem(this.roomName);
        colonyMem.saveColonyStatus(this.getCurrentData());
        console.log('['+this.roomName+']: Colony status saved!')
    }

    public initializeAndSave() {
        this.initialize();
        this.saveToMemory();
    }

    /********************** CONSULTOR *************************/

    public getBuildRCL(): number {
        const mem = this.getMemObject();
        return mem.buildRCL;
    }

    public getFase(): number {
        const colonyStatus = this.getMemObject();
        return colonyStatus.fase;
    }

    public getStorageID(): string {
        const colonyStatus = this.getMemObject();
        return colonyStatus.storageID;
    }

    public getOperationResearchState(): boolean {
        const colonyStatus = this.getMemObject();
        return colonyStatus.operationResearchState;
    }

    /********************** UPDATE *************************/
    public updateBuildRCL(buildRCL: number) {
        const colonyStatus = this.getMemObject();
        colonyStatus.buildRCL = buildRCL;
    }

    public updateFase(fase: number) {
        const colonyStatus = this.getMemObject();
        colonyStatus.fase = fase;
    }

    public updateStorageID(storageID: string) {
        const colonyStatus = this.getMemObject();
        colonyStatus.storageID = storageID;
    }
    public updateOperationResearchState(operationResearchState: boolean) {
        const colonyStatus = this.getMemObject();
        colonyStatus.operationResearchState = operationResearchState;
    }

}