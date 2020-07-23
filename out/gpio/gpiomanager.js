"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPIOAdaptor = exports.InterruptEdge = exports.PullMode = exports.Mode = void 0;
var Gpio = require('onoff').Gpio;
const gpioinstance_1 = require("./gpioinstance");
var Mode;
(function (Mode) {
    Mode["INPUT"] = "in";
    Mode["OUTPUT"] = "out";
})(Mode = exports.Mode || (exports.Mode = {}));
var PullMode;
(function (PullMode) {
    PullMode[PullMode["PUD_OFF"] = 0] = "PUD_OFF";
    PullMode[PullMode["PUD_DOWN"] = 1] = "PUD_DOWN";
    PullMode[PullMode["PUD_UP"] = 2] = "PUD_UP";
})(PullMode = exports.PullMode || (exports.PullMode = {}));
var InterruptEdge;
(function (InterruptEdge) {
    InterruptEdge["RISING_EDGE"] = "rising";
    InterruptEdge["FALLING_EDGE"] = "falling";
    InterruptEdge["EITHER_EDGE"] = "both";
    InterruptEdge["NONE"] = "none";
})(InterruptEdge = exports.InterruptEdge || (exports.InterruptEdge = {}));
class GPIOAdaptor {
    constructor() {
        this.instances = [];
        this.deletedinstance = [];
    }
    createNewInstance(name, pin, mode, owner, timeout, pullUpDown, interruptEdge) {
        let libinstance;
        if (timeout) {
            if (timeout > 0)
                libinstance = new Gpio(pin, mode, InterruptEdge.NONE, { debounceTimeout: timeout });
            else
                throw "Debounce time cannot be zero or less";
        }
        else {
            libinstance = new Gpio(pin, mode);
        }
        let instance = new gpioinstance_1.GPIOInstance(libinstance, owner, name, mode, interruptEdge);
        this.instances[name] = instance;
        return instance;
    }
    deleteInstance(name, permanent = true) {
        let backup = this.instances[name];
        delete this.instances[name];
        if (!permanent) {
            this.deletedinstance[name] = backup;
        }
    }
    getInstance(name) {
        return this.instances[name];
    }
}
exports.GPIOAdaptor = GPIOAdaptor;
