import {ServerMode} from "./util/servermode";
import {Logger} from "./util/logger";
import {INVALID_MESSAGE, UNKNONW_USER} from "./util/constants";

import WebSocket = require("ws");
import http = require("http");
import fs = require("fs");
import { CommandWorker } from "./server/commandworker";
import { Device } from "./devices/device";
import { Shutters } from "./devices/shutters";
import { GPIOAdaptor, Mode } from "./gpio/gpiomanager";
import { generateClientID } from "./util/generator";
import { isThisSecond } from "date-fns";

interface ConnectionObject {
    ip : string;
    authorised : boolean;
    connectedTime : number;
    ws : WebSocket;
}

export interface BaseMessage {
    id : string;
    type : string;
}

class PIHomeServer {

    private ws : WebSocket.Server;
    private logger : Logger;
    private connections : Map<string, ConnectionObject> = new Map();
    private commandworker: CommandWorker;
    private gpio : GPIOAdaptor;
    private devices : Object = {};

    constructor(serverport : number, mode : ServerMode) {
        this.ws = new WebSocket.Server({ port: serverport});
        this.logger = new Logger(mode);
        this.logger.log("Server starting...", false);
        this.initializeServer();
        this.logger.log("Server started...", false);
    }

    private initializeServer() {
        this.ws.addListener("connection", this.connectionHandler.bind(this));
        this.commandworker = new CommandWorker();
        this.commandworker.intializeCommands();
        
        this.gpio = new GPIOAdaptor();
        this.gpio.createNewInstance("relais1", 14, Mode.OUTPUT, "server.js", 100);
        this.gpio.createNewInstance("relais2", 15, Mode.OUTPUT, "server.js", 100);

        let shut = new Shutters(this.gpio);
        this.devices["shutters"] = shut;
    }

    private connectionHandler(ws : WebSocket, req : http.IncomingMessage) {
        let ip = req.connection.remoteAddress;
        let id = generateClientID(ip);
        this.connections.set(id, {ip : ip, authorised : false, connectedTime: Date.now(), ws: ws});
        ws.send(id);

        ws.on("message", (message : string) => {
            try {
                var json = JSON.parse(message);
            } catch (err) {
                ws.send(INVALID_MESSAGE);
                return;
            }
            if (json.id && json.type) {
                if (this.connections.has(json.id)) {
                    let connObject = (this.connections.get(json.id).authorised !== null && this.connections.get(json.id).authorised !== undefined) ?
                    this.connections.get(json.id).authorised :
                    false;
                    if (connObject) {
                        this.commandworker.processCommand(json);
                    } else {
                        if (json.type == "AUTH" || json.type == "SESSION") {
                            this.commandworker.processCommand(json);
                        }
                    }
                } else {
                    ws.send(UNKNONW_USER);
                }
            } else {
                ws.send(INVALID_MESSAGE); 
            }
        });
    }
    
    /**
     * Sends a message to a client. Consider if it is really necessary to use
     * @param message The message to be sent
     * @param id Id of the client
     * @returns True if id exists, false otherwise
     */
    send(message : string, id : string){
        if (this.connections.has(id)) {
            this.connections.get(id).ws.send(message);
            return true;
        }
        return false;
    }

    /**
     * When a client connects, they may have a valid session token. In that case, the connection id needs to be replaced
     * @param oldid Old id
     * @param newid New id
     * @returns True if oldid exists, false otherwise
     */
    replaceID(oldid : string, newid : string) {
        if (this.connections.has(oldid)) {
            let connobject = this.connections.get(oldid);
            this.connections.set(newid, connobject);
            this.connections.delete(oldid);
            return true;
        }
        return false;
    }

    setAuthorised(id : string, value : boolean) {
        if (this.connections.has(id)) {
            let connobject = this.connections.get(id);
            connobject.authorised = value;
            this.connections.set(id, connobject);
            return true;
        }
        return false;
    }

    /**
     * Get Devices
     */
    getDevices() {
        if (Object.keys(this.devices).length > 0)
            return this.devices;
        else 
            return null;
    }
}

//Initialisation
const data = fs.readFileSync('./wsport.txt', {encoding:'utf8', flag:'r'}); 

const server : PIHomeServer = new PIHomeServer(parseInt(data), ServerMode.PRODUCTION);
export default server;
