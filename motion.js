var gpiomanager_1 = require("./gpio/gpiomanager");

var gpio = new gpiomanager_1.GPIOAdaptor();
gpio.createNewInstance("pull_23", 23, gpiomanager_1.Mode.INPUT, this);
gpio.createNewInstance("pull_24", 24, gpiomanager_1.Mode.INPUT, this);

var triggers = 0;
var lastpin;

directions = [
    "UP",
    "DOWN"
];

var direction = directions[1];

var invalidconsecutive = false;
var invalidconsectutivetimer;

gpio.getInstance("pull_23").addWatcher((er, val) => {
    if (val == 1) {
        triggers++;
        if (triggers > 2) { 
            compareTriggers(23);
            lastpin = 23;
            update();
        }
    }   
});

gpio.getInstance("pull_24").addWatcher((er, val) => {
    if (val == 1) {
        if (triggers > 2) {
            compareTriggers(24);
            lastpin = 24;
            triggers++;
            update();
        }
    }
});

function compareTriggers(current) {
    if (lastpin === current) {
        console.log("Consecutive Trigger");
        if (!invalidconsecutive) {
            invalidconsecutive = true;
            invalidconsecutivetimer = setTimeout(() => {
                invalidconsecutive = false;
            }, 10000);
            changeDirection();
        }
    }
}

function changeDirection() {
    triggers = 0;
    if (direction === directions[0]) {
        direction = directions[1];
    } else {
        direction = directions[0];
    }
}

function update() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("Direction: " + direction + "||||triggers: " + triggers + "||||last pin: " + lastpin);
    process.stdout.write("\n");
}