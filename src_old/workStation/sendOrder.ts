import {LogisticWorkStation} from "@/workStation/logisticWorkStation";
import {BuilderWorkStation} from "@/workStation/builderWorkStation";

export class SendOrder {

    roomName: string;

    constructor(roomName: string) {
        this.roomName = roomName;
    }

    /*************************** HARVESTER STATION ***********************************/
    harvester_sendOrder(stationID: StationType, orderType: HarvesterWorkStationOrderType, data?: {}) {
        const order: HarvesterWorkStationOrder = {
            name: orderType,
            data: null
        }
        if(data) order.data = data;
        Memory['colony'][this.roomName]['dpt_harvest'][stationID]['order'].push(order);

        //const station = new HarvesterWorkStation(this.roomName, stationID);
        //station.addOrder(order);
    }

    logistic_sendOrder(stationID: StationType, orderType: LogisticWorkStationOrderType, orderData: TransporterTaskLocation) {

        const order: LogisticWorkStationOrder = {
            name: orderType,
            data: orderData
        }
        const station = new LogisticWorkStation(this.roomName, stationID);
        station.addOrder(order);
    }

    builder_sendOrder(stationID: StationType, orderType: BuilderWorkStationOrderType, orderData: AddConstructionSideData) {
        const order:BuilderWorkStationOrder = {
            name: orderType,
            data: orderData
        }
        const station = new BuilderWorkStation(this.roomName, stationID);
        station.addOrder(order);

    }







}