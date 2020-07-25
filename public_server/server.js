"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const servermode_1 = require("./util/servermode");
const logger_1 = require("./util/logger");
const constants_1 = require("./util/constants");
const WebSocket = require("ws");
const fs = require("fs");
const commandworker_1 = require("./server/commandworker");
const shutters_1 = require("./devices/shutters");
const gpiomanager_1 = require("./gpio/gpiomanager");
const generator_1 = require("./util/generator");
class PIHomeServer {
    constructor(serverport, mode) {
        this.connections = new Map();
        this.devices = [];
        this.ws = new WebSocket.Server({ port: serverport });
        this.logger = new logger_1.Logger(mode);
        this.logger.log("Server starting...", false);
        this.initializeServer();
        this.logger.log("Server started...", false);
    }
    initializeServer() {
        this.ws.addListener("connection", this.connectionHandler.bind(this));
        this.commandworker = new commandworker_1.CommandWorker();
        this.commandworker.intializeCommands();
        this.gpio = new gpiomanager_1.GPIOAdaptor();
        this.gpio.createNewInstance("relais1", 14, gpiomanager_1.Mode.OUTPUT, "server.js", 100);
        this.gpio.createNewInstance("relais2", 15, gpiomanager_1.Mode.OUTPUT, "server.js", 100);
        let shut = new shutters_1.Shutters(this.gpio);
        this.devices["shutters"] = shut;
    }
    connectionHandler(ws, req) {
        let ip = req.connection.remoteAddress;
        let id = generator_1.generateClientID(ip);
        this.connections.set(id, { ip: ip, authorised: false, connectedTime: Date.now(), ws: ws });
        ws.send(id);
        ws.on("message", (message) => {
            try {
                var json = JSON.parse(message);
            }
            catch (err) {
                ws.send(constants_1.INVALID_MESSAGE);
                return;
            }
            if (json.id && json.type) {
                let connObject = (this.connections.get(json.id).authorised !== null && this.connections.get(json.id).authorised !== undefined) ?
                    this.connections.get(json.id).authorised :
                    false;
                if (connObject) {
                    this.commandworker.processCommand(json);
                }
                else {
                    if (json.type == "AUTH" || json.type == "SESSION") {
                        this.commandworker.processCommand(json);
                    }
                }
            }
            else {
                ws.send(constants_1.INVALID_MESSAGE);
            }
        });
    }
    send(message, id) {
        if (this.connections.has(id)) {
            this.connections.get(id).ws.send(message);
            return true;
        }
        return false;
    }
    replaceID(oldid, newid) {
        if (this.connections.has(oldid)) {
            let connobject = this.connections.get(oldid);
            this.connections.set(newid, connobject);
            this.connections.delete(oldid);
            return true;
        }
        return false;
    }
    setAuthorised(id, value) {
        if (this.connections.has(id)) {
            let connobject = this.connections.get(id);
            connobject.authorised = value;
            this.connections.set(id, connobject);
            return true;
        }
        return false;
    }
    getDevices() {
        if (this.devices.length > 0)
            return this.devices;
        else
            return null;
    }
}
const data = fs.readFileSync('./wsport.txt', { encoding: 'utf8', flag: 'r' });
const server = new PIHomeServer(parseInt(data), servermode_1.ServerMode.PRODUCTION);
exports.default = server;
