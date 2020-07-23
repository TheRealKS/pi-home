"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPositionProvider = exports.PositionProvider = exports.Direction = void 0;
const gpiomanager_1 = require("../gpio/gpiomanager");
const gpioinstance_1 = require("../gpio/gpioinstance");
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
})(Direction = exports.Direction || (exports.Direction = {}));
class PositionProvider {
    constructor(s1, s2, startingposition, startingdirection) {
        this.triggers = 0;
        this.abouttooperate = false;
        this.invalidtriggers = 3;
        this.switch1 = s1;
        this.switch2 = s2;
        if (startingposition) {
            this.triggers = startingposition;
        }
        if (startingdirection) {
            this.currentdirection = startingdirection;
        }
        this.switch1.setEdge(gpiomanager_1.InterruptEdge.RISING_EDGE);
        this.switch2.setEdge(gpiomanager_1.InterruptEdge.RISING_EDGE);
        this.pulsetimers = [];
    }
    register() {
        this.switch1.libraryinstance = this.switch1.addWatcher((er, val) => {
            this.processTrigger(er, val, 23);
        });
        this.switch2.libraryinstance = this.switch2.addWatcher((er, val) => {
            this.processTrigger(er, val, 24);
        });
        console.log(JSON.stringify(this.switch2.libraryinstance));
    }
    processTrigger(er, val, pin) {
        console.log(pin);
        if (er || val !== 1) {
        }
        if (this.abouttooperate && this.invalidtriggers > 0) {
            this.invalidtriggers--;
        }
        else if (!this.abouttooperate && this.invalidtriggers === 0) {
            this.abouttooperate = false;
            this.invalidtriggers = 3;
            if (this.lasttriggered)
                this.validateTrigger(pin);
            this.lasttriggered = pin;
        }
    }
    validateTrigger(trigger) {
        if (this.lasttriggered === trigger) {
            if (!this.consecutiverecent) {
                this.consecutiverecent = true;
                this.recentconsecutivetimer = setTimeout(() => {
                    this.consecutiverecent = false;
                }, 10000);
                this.changeDirection();
            }
            else {
                this.triggers++;
            }
        }
        else {
            this.triggers++;
        }
    }
    changeDirection() {
        this.triggers = 0;
        this.abouttooperate = true;
        if (this.currentdirection === Direction.UP) {
            this.currentdirection = Direction.DOWN;
        }
        else {
            this.currentdirection = Direction.UP;
        }
    }
    validate(gpio, callback) {
        var savedtriggers = this.triggers;
        gpio.getInstance("relais1").setState(gpioinstance_1.State.HIGH);
        setTimeout(function (s) {
            gpio.getInstance("relais1").setState(gpioinstance_1.State.LOW);
            callback(s);
        }.bind(null, savedtriggers), 1000);
    }
    primeForOperation() {
        this.abouttooperate = true;
    }
    getTriggers() {
        return this.triggers.toString();
    }
    getDirection() {
        if (this.currentdirection === Direction.DOWN) {
            return "DOWN";
        }
        else {
            return "UP";
        }
    }
}
exports.PositionProvider = PositionProvider;
function initPositionProvider(gpio) {
    let instance1 = gpio.createNewInstance("switch1", 23, gpiomanager_1.Mode.INPUT, "positionprovider");
    let instance2 = gpio.createNewInstance("switch2", 24, gpiomanager_1.Mode.INPUT, "positionprovider");
    let provider = new PositionProvider(instance1, instance2, 0, Direction.DOWN);
    provider.register();
    provider.validate(gpio, (result) => {
        if (result >= this.triggers) {
            console.error("Provider not initialized correctly!");
        }
        else {
            console.log("Provider initialized");
        }
    });
    return provider;
}
exports.initPositionProvider = initPositionProvider;
