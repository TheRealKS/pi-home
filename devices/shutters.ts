import { Device } from "./device";
import { GPIOAdaptor } from "../gpio/gpiomanager";
import { State } from "../gpio/gpioinstance";
import { ACTUATIONTIME } from "../util/constants";

export class Shutters extends Device {

    private gpio : GPIOAdaptor;
    private timeout : NodeJS.Timer;
    private position : number; //TODO: Replace this with real position provider

    constructor(g : GPIOAdaptor) {
        super();
        this.name = "shutters";
        this.gpio = g;
    }

    getCurrentPosition() {
        return this.position;
    }

    /**
     * Moves the blinds completely up (22 secs)
     */
    moveUp() {
        this.up();
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.stop.bind(this), ACTUATIONTIME);
        setTimeout(() => this.position = 0, ACTUATIONTIME);
    }

    /**
     * Moves the blinds completely down (22 secs)
     */
    moveDown() {
        this.down();
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.stop.bind(this), ACTUATIONTIME);
        setTimeout(() => this.position = 100, ACTUATIONTIME);
    }

    /**
     * Stops the blinds immediately
     * @param fromTimeout whether the stop function is called from a timeout (moveup, down)
     */
    stop(fromTimeout = true) {
        this.gpio.getInstance("relais1").setState(State.LOW);
        this.gpio.getInstance("relais2").setState(State.LOW);
        if (fromTimeout)
            this.timeout = undefined;
    }

    private up() {
        this.gpio.getInstance("relais1").setState(State.HIGH);
        this.gpio.getInstance("relais2").setState(State.HIGH);
    }

    private down() {
        this.gpio.getInstance('relais1').setState(State.HIGH);
    }
}