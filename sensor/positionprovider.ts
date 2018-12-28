import {GPIOAdaptor, Mode, PullMode, InterruptEdge} from "../gpio/gpiomanager";
import { GPIOInstance, State } from "../gpio/gpioinstance";

export enum Direction {
    UP, DOWN
}

export class PositionProvider {
    private switch1 : GPIOInstance;
    private switch2 : GPIOInstance;

    private triggers : number = 0;
    private lasttriggered : number;
    private currentdirection : Direction;

    private consecutiverecent : boolean;
    private recentconsecutivetimer : NodeJS.Timer;

    private abouttooperate : boolean = false;
    private invalidtriggers : number = 3;

    constructor(s1 : GPIOInstance, s2: GPIOInstance, startingposition? : number, startingdirection? : Direction) {
        this.switch1 = s1;
        this.switch2 = s2;
        if (startingposition) {
            this.triggers = startingposition;
        }
        if (startingdirection) {
            this.currentdirection = startingdirection;
        }
        this.switch1.setEdge(InterruptEdge.RISING_EDGE);
        this.switch2.setEdge(InterruptEdge.RISING_EDGE);
    }  
    
    /**
     * (Re)registers the watchers for the switches
     */
    register() {
        this.switch1.libraryinstance = this.switch1.addWatcher((er, val) => {
            this.processTrigger(er, val, 23);
        });
        this.switch2.libraryinstance = this.switch2.addWatcher((er, val) => {
           this.processTrigger(er, val, 24);
        });
        console.log(JSON.stringify(this.switch2.libraryinstance));        
    }
 
    private processTrigger(er : any, val : any, pin : number) {
        console.log(val);
        if (er || val !== 1) {
            console.error("NOOOO");
            return;
        }
        if (this.abouttooperate && this.invalidtriggers > 0) {
            this.invalidtriggers--;
        } else {
            this.abouttooperate = false;
            this.invalidtriggers = 3;
            if (this.lasttriggered) this.validateTrigger(pin); 
            else this.lasttriggered = pin;
        }
    }

    private validateTrigger(trigger : number) {
        if (this.lasttriggered === trigger) {
            if (!this.consecutiverecent) {
                this.consecutiverecent = true;
                this.recentconsecutivetimer = setTimeout(() => {
                    this.consecutiverecent = false;
                }, 10000);
                this.changeDirection();
            } else {
                this.triggers++;
            }
        } else {
            this.triggers++; 
        }
    }

    private changeDirection() {
        this.triggers = 0;
        this.abouttooperate = true;
        if (this.currentdirection === Direction.UP) {
            this.currentdirection = Direction.DOWN;
        } else {
            this.currentdirection = Direction.UP;
        }
    }

    /**
     * Returns whether or not the provider has been initalized correctly;
     */
    validate(gpio : GPIOAdaptor, callback : Function) {  
        var savedtriggers = this.triggers;  
        gpio.getInstance("relais1").setState(State.HIGH);
        setTimeout(function() {
            gpio.getInstance("relais1").setState(State.LOW);
            callback(this.triggers > savedtriggers);
        }, 10000);   
    }

    /**
     * Primes the provider for operation, i.e. it ensures that the invalid triggers are processed correctly.
     */
    primeForOperation() {
        this.abouttooperate = true;
    }

    getTriggers() {
        return this.triggers.toString();
    }

    getDirection() {
        if (this.currentdirection === Direction.DOWN) {
            return "DOWN";
        } else {
            return "UP";
        }
    }
}

export function initPositionProvider(gpio : GPIOAdaptor) : PositionProvider {
    let instance1 = gpio.createNewInstance("switch1", 23, Mode.INPUT, "positionprovider");
    let instance2 = gpio.createNewInstance("switch2", 24, Mode.INPUT, "positionprovider");

    //Here, we should read a config to find the previous state but i am too lazy to implement that now

    let provider = new PositionProvider(instance1, instance2, 0, Direction.DOWN);
    provider.register();
    provider.validate(gpio, (result) => {
        if (!result) {
            console.error("Provider not initialized correctly!");
        } else {
            console.log("Provider initialized");
        }
    });

    return provider;
}