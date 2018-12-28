/// <reference types="ws" />

import * as CommandWorker from "./server/commandworker";
import { AuthorisationJsonMessage, JsonMessage, CommandJsonMessage } from './server/jsondecoder';
import { processCommand } from './server/commandworker';
import { GPIOAdaptor, Mode } from "./gpio/gpiomanager";
import { AuthcodeCheckReturnValue, checkAuthCode } from "./server/authorisationmanager";
import { generateAuthorizedJSON, generateNotAuthorizedJSON } from "./server/jsongenerator";
import { PositionProvider, initPositionProvider } from "./sensor/positionprovider";

const WebSocket = require("ws");

const ws = new WebSocket.Server({ port: 6748 });

global.history = new CommandWorker.CommandHistoryRegistry();

interface ConnectionObject {
    websocket: any,
    authorised: boolean,
    ip: any
}

var connections: Map<string, ConnectionObject> = new Map();

var gpio = new GPIOAdaptor();
gpio.createNewInstance("relais1", 14, Mode.OUTPUT, "server.js");
gpio.createNewInstance("relais2", 15, Mode.OUTPUT, "server.js");

var posprovider : PositionProvider = initPositionProvider(gpio);

var auxcollection = {pos: posprovider};

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

function generateID() {
    let abc = "abcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (var i = 0; i < 6; i++) {
        id += Math.floor((Math.random() * abc.length-1));
    }
    return id;
}

console.log("Server started");
