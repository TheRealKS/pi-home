import {
    CommandJsonMessage
} from "./jsondecoder";

import {
    GPIOAdaptor
} from "../gpio/gpiomanager";
import {
    State
} from "../gpio/gpioinstance";

import {
    closestTo
} from "date-fns";

export enum Command {
    UP = 'up',
    DOWN = 'down',
    STOP = 'stop'
}

export class CommandHistoryRegistryEntry {
    command: Command;
    timestamp: number;
    sendby: string;
    constructor(command: Command, timestamp: number, sendby: string) {
        this.command = command;
        this.timestamp = timestamp;
        this.sendby = sendby;
    }
}

export class CommandHistoryRegistry {
    private entries: Array<CommandHistoryRegistryEntry> = [];

    working = false;
    currenttimer = null;

    private listeners = [];

    addEntry(entry: CommandHistoryRegistryEntry, dispatchEvent : boolean) {
        if (dispatchEvent)
        this.setWorkingState(true);
        this.entries.push(entry);
    }

    setWorkingState(state : boolean) {
        this.working = state;
        if (state) {
            this.listeners["working"](this.getLatestEntry().command);
        } else {
            this.listeners["stopworking"]();
        }
    }

    getEntryNearOrOnTimestamp(timestamp: number): CommandHistoryRegistryEntry {
        let timestampsarray = [];
        this.entries.forEach(element => {
            if (element.timestamp === timestamp) {
                return element;
            }
            timestampsarray.push(element.timestamp);
        });
        let closesttime = closestTo(timestamp, timestampsarray).getTime();
        this.entries.forEach(element => {
            if (element.timestamp === closesttime) {
                return element;
            }
        });
        return undefined;
    }

    getLatestEntry(): CommandHistoryRegistryEntry {
        return this.entries[this.entries.length - 1];
    }

    getEarliestEntry(): CommandHistoryRegistryEntry {
        return this.entries[0];
    }

    on(eventtype: string, callback: Function) {
        if (this.listeners[eventtype]) {
            throw "Cannot registter second listener for event";
        }
        this.listeners[eventtype] = callback;
    }
}

export function processCommand(message: CommandJsonMessage, sender: string, gpio: GPIOAdaptor) {
    //@ts-ignore
    if (global.history.currentimer) {
        //@ts-ignore
        global.history.setWorkingState(false);
        gpio.getInstance('relais1').setState(State.LOW);
        gpio.getInstance('relais2').setState(State.LOW);
        //@ts-ignore
        clearTimeout(global.history.currenttimer);
    }
    if (message.command === Command.UP) {
        gpio.getInstance("relais1").setState(State.HIGH);
        gpio.getInstance("relais2").setState(State.HIGH);
        setCommandTimer(gpio);
        //@ts-ignore
        global.history.addEntry(new CommandHistoryRegistryEntry(Command.UP, Date.now(), sender), true);
    } else if (message.command === Command.DOWN) {
        gpio.getInstance('relais1').setState(State.HIGH);
        //@ts-ignore
        global.history.addEntry(new CommandHistoryRegistryEntry(Command.DOWN, Date.now(), sender), true);
        setCommandTimer(gpio);
    } else if (message.command === Command.STOP) {
        //@ts-ignore
        global.history.setWorkingState(false);
        //@ts-ignore
        global.history.addEntry(new CommandHistoryRegistryEntry(Command.STOP, Date.now(), sender), false);   
        gpio.getInstance('relais1').setState(State.LOW);
        gpio.getInstance('relais2').setState(State.LOW);
    }
}

export function setCommandTimer(gpio: GPIOAdaptor) {
    //@ts-ignore
    global.history.currenttimer = setTimeout(() => {
        gpio.getInstance("relais1").setState(State.LOW);
        gpio.getInstance("relais2").setState(State.LOW);
        //@ts-ignore
        global.history.setWorkingState(false);
        //@ts-ignore
        global.history.currenttimer = undefined;
    }, 22000);
}