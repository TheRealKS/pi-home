import { ServerMode } from "./servermode";
import { Server } from "ws";

export class Logger {
    private mode : ServerMode;
    constructor(mode : ServerMode)  {
        this.mode = mode;
    }

    log(message : string, trace? : boolean) {
        if (this.mode == ServerMode.VERBOSE || this.mode == ServerMode.REALLYVERBOSE) {
            console.log(message);
            if (trace) {
                console.trace();
            }
        }
    }

    logverbose(message : string, trace? : boolean) {
        if (this.mode == ServerMode.REALLYVERBOSE) {
            console.log(message);
            if (trace) {
                console.trace();
            }
        }
    }

    warn(message : string, trace? : boolean) {
        if (this.mode == ServerMode.ERRORONLY || this.mode == ServerMode.VERBOSE || this.mode == ServerMode.REALLYVERBOSE) {
            console.warn(message);
            if (trace) {
                console.trace();
            }
        }
    }

    error(message : string, trace? : boolean) {
        if (this.mode == ServerMode.ERRORONLY || this.mode == ServerMode.VERBOSE || this.mode == ServerMode.REALLYVERBOSE) {
            console.error(message);
            if (trace) {
                console.trace();
            }
        }
    }
}