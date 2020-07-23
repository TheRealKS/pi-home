"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateErrorJSON = exports.generateNotAuthorizedJSON = exports.generateAuthorizedJSON = void 0;
function createBaseJSON(type) {
    return {
        "type": type
    };
}
function generateAuthorizedJSON(timeleft) {
    let o = createBaseJSON("auth");
    o["valid"] = true;
    o["timeleft"] = timeleft;
    return JSON.stringify(o);
}
exports.generateAuthorizedJSON = generateAuthorizedJSON;
function generateNotAuthorizedJSON(error, errordetails) {
    let o = createBaseJSON("auth");
    o["valid"] = false;
    o["error"] = error;
    o["errordetails"] = errordetails;
    return JSON.stringify(o);
}
exports.generateNotAuthorizedJSON = generateNotAuthorizedJSON;
function generateErrorJSON(error, code, type = "normal") {
    let o = createBaseJSON("error");
    o["error"] = error;
    o["type"] = type;
    o["code"] = code;
    return JSON.stringify(o);
}
exports.generateErrorJSON = generateErrorJSON;
