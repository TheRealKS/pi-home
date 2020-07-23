"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const servermode_1 = require("./servermode");
class Logger {
    constructor(mode) {
        this.mode = mode;
    }
    log(message, trace) {
        if (this.mode == servermode_1.ServerMode.VERBOSE || this.mode == servermode_1.ServerMode.REALLYVERBOSE) {
            console.log(message);
            if (trace) {
                console.trace();
            }
        }
    }
    logverbose(message, trace) {
        if (this.mode == servermode_1.ServerMode.REALLYVERBOSE) {
            console.log(message);
            if (trace) {
                console.trace();
            }
        }
    }
    warn(message, trace) {
        if (this.mode == servermode_1.ServerMode.ERRORONLY || this.mode == servermode_1.ServerMode.VERBOSE || this.mode == servermode_1.ServerMode.REALLYVERBOSE) {
            console.warn(message);
            if (trace) {
                console.trace();
            }
        }
    }
    error(message, trace) {
        if (this.mode == servermode_1.ServerMode.ERRORONLY || this.mode == servermode_1.ServerMode.VERBOSE || this.mode == servermode_1.ServerMode.REALLYVERBOSE) {
            console.error(message);
            if (trace) {
                console.trace();
            }
        }
    }
}
exports.Logger = Logger;
