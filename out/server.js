"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const servermode_1 = require("./util/servermode");
const logger_1 = require("./util/logger");
const constants_1 = require("./util/constants");
const js_sha3_1 = require("js-sha3");
const WebSocket = require("ws");
const fs = require("fs");
const commandworker_1 = require("./server/commandworker");
class PIHomeServer {
    constructor(serverport, mode) {
        this.ws = new WebSocket.Server({ port: serverport });
        this.logger = new logger_1.Logger(mode);
        this.logger.log("Server starting...", false);
        this.initializeServer();
        this.logger.log("Server started...", false);
    }
    initializeServer() {
        this.ws.addListener("connection", this.connectionHandler);
        this.commandworker = new commandworker_1.CommandWorker();
    }
    connectionHandler(ws, req) {
        ws.on("open", () => {
            let ip = req.connection.remoteAddress;
            let id = js_sha3_1.shake128(ip + Date.now(), 128);
            this.connections.set(id, { ip: ip, authorised: false, connectedTime: Date.now() });
        });
        ws.on("message", (message) => {
            var _a;
            var json = JSON.parse(message);
            if (json.id && json.type) {
                let connObject = (_a = this.connections.get(json.id).authorised) !== null && _a !== void 0 ? _a : false;
                if (connObject) {
                    this.commandworker.processCommand(json);
                }
            }
            else {
                ws.send(constants_1.INVALID_MESSAGE);
            }
        });
    }
}
function processMessage(message, ip) {
    let rawjson = message;
    switch (rawjson.type) {
        case "command":
            if (!connections.get(ip).authorised)
                break;
            let commandmessage = rawjson;
            processCommand(commandmessage, ip, gpio, auxcollection);
            break;
        case "auth":
            let authmessage = rawjson;
            checkAuthCode(authmessage, continueAuthProcess, ip);
        default:
            break;
    }
}
function continueAuthProcess(returnvalue, ip) {
    let date = new Date();
    let timestr = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + "||" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    if (returnvalue.authorised === true) {
        connections.get(ip).websocket.send(generateAuthorizedJSON(returnvalue.timeleft));
        connections.get(ip).authorised = true;
        console.log(timestr + "  --  New client authorized from ip " + connections.get(ip).ip);
    }
    else {
        if (returnvalue.errordetails)
            connections.get(ip).websocket.send(generateNotAuthorizedJSON(returnvalue.error, returnvalue.errordetails.message));
        else
            connections.get(ip).websocket.send(generateNotAuthorizedJSON(returnvalue.error, undefined));
        connections.get(ip).websocket.close();
        connections.get(ip).authorised = false;
        console.log(timestr + "  --  Connection refused from ip " + connections.get(ip).ip + ", code: " + returnvalue.error);
    }
}
const data = fs.readFileSync('./wsport.txt', { encoding: 'utf8', flag: 'r' });
const server = new PIHomeServer(parseInt(data), servermode_1.ServerMode.PRODUCTION);
