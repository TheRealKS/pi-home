import {ServerMode} from "./util/servermode";
import {Logger} from "./util/logger";

import { shake128 } from 'js-sha3';
import WebSocket = require("ws");
import http = require("http");

interface ConnectionObject {

}

class PIHomeServer {

    private ws : WebSocket.Server;
    private logger : Logger;
    private connections : Map<string, ConnectionObject>;

    constructor(port : number, mode : ServerMode) {
        this.ws = new WebSocket.Server({ port: 6748});
        this.logger = new Logger(mode);
        this.logger.log("Server starting...", false);
        this.initializeServer();
        this.logger.log("Server started...", false);
    }

    private initializeServer() {
        ws.addListener("connection", this.connectionHandler);
    }

    private connectionHandler(ws : WebSocket, req : http.IncomingMessage) {
        ws.on("open", () => {
            let ip = req.connection.remoteAddress;
            let id = shake128(ip + Date.now(), 128);
            this.connections.set(id, {ip : ip, authorised : false, connectedTime: Date.now()});
        });
        ws.on("message", (message : string) => {
            var json = JSON.parse(message);
            if (json.id) {
                let connObject = this.connections.get(json.id).authorised ?? false;
                if (connObject) {
                    processMessage(message);
                }
            } else {
                ws.send(INVALID_MESSAGE);
            }
        });
    }
}

const ws = new WebSocket.Server({ port: 6748 });
ws.on("connection", function (ws, req) {
    let ip = req.connection.remoteAddress;
    let id = generateID();
    connections.set(id, { websocket: ws, authorised: false, ip: ip})
    ws.on('message', msg => {
        try {
            var json = JSON.parse(msg);
            processMessage(json, id);
        } catch (error) {
            console.log(error);
            //TODO: response to client
            return;
        }
    });
});

function processMessage(message, ip) {
    let rawjson = <JsonMessage>message;
    switch (rawjson.type) {
        case "command":
            if (!connections.get(ip).authorised) break;
            let commandmessage: CommandJsonMessage = <CommandJsonMessage>rawjson;
            processCommand(commandmessage, ip, gpio, auxcollection);
            break;
        case "auth":
            let authmessage: AuthorisationJsonMessage = <AuthorisationJsonMessage>rawjson;
            checkAuthCode(authmessage, continueAuthProcess, ip);
        default:
            break;
    }
}

function continueAuthProcess(returnvalue: AuthcodeCheckReturnValue, ip) {
    let date = new Date();
    let timestr = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + "||" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    if (returnvalue.authorised === true) {
        connections.get(ip).websocket.send(generateAuthorizedJSON(returnvalue.timeleft));
        connections.get(ip).authorised = true;
        console.log(timestr + "  --  New client authorized from ip " + connections.get(ip).ip);
    } else {
        if (returnvalue.errordetails)
        connections.get(ip).websocket.send(generateNotAuthorizedJSON(returnvalue.error, returnvalue.errordetails.message));
        else
        connections.get(ip).websocket.send(generateNotAuthorizedJSON(returnvalue.error, undefined));
        connections.get(ip).websocket.close(); //Not authorised
        connections.get(ip).authorised = false;
        console.log(timestr + "  --  Connection refused from ip " + connections.get(ip).ip + ", code: " + returnvalue.error);
    }
}

console.log("Server started");
