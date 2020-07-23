"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMessage = void 0;
function processMessage(message) {
    let rawjson = message;
    switch (rawjson.type) {
        case "command":
            let commandmessage = rawjson;
            return commandmessage;
        case "auth":
            let authmessage = rawjson;
            return authmessage;
        default:
            break;
    }
}
exports.processMessage = processMessage;
