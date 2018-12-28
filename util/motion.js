var gpiomanager_1 = require("./gpio/gpiomanager");

var gpio = new gpiomanager_1.GPIOAdaptor();
gpio.createNewInstance("pull_23", 23, Mode.INPUT, this);
gpio.createNewInstance("pull2_24", 24, Mode.INPUT, this);

gpio.getInstance("pull_23").addWatcher((er, val) => {
    console.log(val);
});

gpio.getInstance("pull_24").addWatcher((er, val) => {
    console.log(val);
})