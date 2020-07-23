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
import { PositionProvider } from "../sensor/positionprovider";
import { ICommand } from "./ICommand";
import { BaseMessage } from "../server";
import { CommandResult } from "./commandresult";

interface AuxiliaryCollection {
    pos : PositionProvider
}

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
        this.entries.push(entry);
        if (dispatchEvent)
        this.setWorkingState(true);
    }

    setWorkingState(state : boolean) {
        this.working = state;
        if (state) {
            if (this.listeners["working"])
            this.listeners["working"](this.getLatestEntry().command);
        } else {
            if (this.listeners["stopworking"])
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

export class CommandWorker {

    commands : Map<string, ICommand> = new Map();

    constructor() {

    }

    intializeCommands() {

    }

    processCommand(json : BaseMessage) {
        if (this.commands.has(json.type)) {
            let handler : ICommand = this.commands.get(json.type);
            let cmdresult : CommandResult = handler.handle(json);
        } else {
            return 
        }
    }
}

export function processCommand(message: CommandJsonMessage, sender: string, gpio: GPIOAdaptor, collection : AuxiliaryCollection) {
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
        collection.pos.primeForOperation();
        gpio.getInstance("relais1").setState(State.HIGH);
        gpio.getInstance("relais2").setState(State.HIGH);
        setCommandTimer(gpio);
        //@ts-ignore
        global.history.addEntry(new CommandHistoryRegistryEntry(Command.UP, Date.now(), sender), true);
    } else if (message.command === Command.DOWN) {
        collection.pos.primeForOperation();
        gpio.getInstance('relais1').setState(State.HIGH);
        //@ts-ignore
        global.history.addEntry(new CommandHistoryRegistryEntry(Command.DOWN, Date.now(), sender), true);
        setCommandTimer(gpio);
    } else if (message.command === Command.STOP) {
        //@ts-ignore
        console.log(collection.pos.getTriggers());
        console.log(collection.pos.getDirection());
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