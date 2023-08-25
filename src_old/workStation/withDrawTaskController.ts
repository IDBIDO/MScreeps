import ColonyMem from "@/access_mem/colonyMem";
import {SendOrder} from "@/workStation/sendOrder";

export class WithDrawTaskController {

    roomName: string;
    withDrawTaskInfoList: ID_Room_position[];

    mem: ID_Room_position[]

    constructor(roomName: string) {
        this.roomName = roomName;
        //this.mem = Memory['colony']
        const colonyMem = new ColonyMem(this.roomName);
        this.mem = colonyMem.getWithdrawTaskController();
    }

    public initializeAndSave() {

    }

    public addWithdrawObject(info: ID_Room_position) {
        const withdrawTaskInfo: ID_Room_position = info;
        this.mem.push(withdrawTaskInfo);
    }

    public deleteWithdrawObject(id: string) {
        for (let i = 0; i < this.mem.length; ++i) {
            if (this.mem[i].id == id) {
                this.mem.splice(i, 1);
                break;
            }
        }
    }

    private sendTask(structureInfo: ID_Room_position) {
        const sendOrder = new SendOrder(this.roomName);
        const orderData: TransporterTaskData = {
            amount: 0,
            resourceType: undefined,
            stationDpt: undefined,
            stationId: "",
            taskObjectInfo: undefined,
            taskType: undefined,
            transporterCreepName: ""

        }
        sendOrder.logistic_sendOrder('internal', 'ADD_TASK', orderData);
    }

    public run() {
        // send withdrawTask
        for (const structureInfo of this.mem) {
            const structure = Game.getObjectById(structureInfo.id as Id<StructureContainer>);
            if (structure) {
                const usedCapacity = structure.store.getUsedCapacity();
                const totalCapacity = structure.store.getCapacity();
                if (usedCapacity > totalCapacity/2) {
                    const sendOrder = new SendOrder(this.roomName);
                    const orderData: TransporterTaskData = {
                        amount: usedCapacity,   //@ts-ignore
                        resourceType: Object.keys(structure.store)[0],
                        stationDpt: undefined,
                        stationId: "",
                        taskObjectInfo: structureInfo,
                        taskType: 'WITHDRAW',
                        transporterCreepName: null,

                    }
                    sendOrder.logistic_sendOrder('internal', 'ADD_TASK', orderData);
                }
            }
        }
    }












}