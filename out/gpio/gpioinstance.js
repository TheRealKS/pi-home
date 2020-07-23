"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPIOInstance = exports.State = void 0;
const gpiomanager_1 = require("./gpiomanager");
var State;
(function (State) {
    State[State["HIGH"] = 1] = "HIGH";
    State[State["LOW"] = 0] = "LOW";
})(State = exports.State || (exports.State = {}));
class GPIOInstance {
    constructor(libinstance, createdBy, name, mode, edge) {
        this.libraryinstance = null;
        this.libraryinstance = libinstance;
        this.owner = createdBy;
        this.name = name;
        this.type = mode;
        if (edge) {
            this.edge = edge;
            this.libraryinstance.setEdge(edge);
        }
    }
    setState(state) {
        this.libraryinstance.write(state, err => {
            if (err)
                console.log(err);
        });
    }
    setEdge(edge) {
        if (this.type == gpiomanager_1.Mode.OUTPUT) {
            throw "Cannot set an interrupt edge for an output gpio instance";
        }
        this.libraryinstance.setEdge(edge);
        let backup = this.edge;
        this.edge = edge;
        return backup;
    }
    addWatcher(c) {
        if (this.type == gpiomanager_1.Mode.OUTPUT) {
            throw "Cannot register a watcher for an output gpio instance";
        }
        if (!this.edge) {
            this.setEdge(gpiomanager_1.InterruptEdge.RISING_EDGE);
        }
        this.libraryinstance.watch(c);
        this.libraryinstance.watch((er, val) => {
        });
        return this.libraryinstance;
    }
}
exports.GPIOInstance = GPIOInstance;
