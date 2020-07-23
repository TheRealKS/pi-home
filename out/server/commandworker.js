"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandWorker = exports.CommandHistoryRegistry = exports.CommandHistoryRegistryEntry = exports.Command = void 0;
const date_fns_1 = require("date-fns");
var Command;
(function (Command) {
    Command["UP"] = "up";
    Command["DOWN"] = "down";
    Command["STOP"] = "stop";
})(Command = exports.Command || (exports.Command = {}));
class CommandHistoryRegistryEntry {
    constructor(command, timestamp, sendby) {
        this.command = command;
        this.timestamp = timestamp;
        this.sendby = sendby;
    }
}
exports.CommandHistoryRegistryEntry = CommandHistoryRegistryEntry;
class CommandHistoryRegistry {
    constructor() {
        this.entries = [];
        this.working = false;
        this.currenttimer = null;
        this.listeners = [];
    }
    addEntry(entry, dispatchEvent) {
        this.entries.push(entry);
        if (dispatchEvent)
            this.setWorkingState(true);
    }
    setWorkingState(state) {
        this.working = state;
        if (state) {
            if (this.listeners["working"])
                this.listeners["working"](this.getLatestEntry().command);
        }
        else {
            if (this.listeners["stopworking"])
                this.listeners["stopworking"]();
        }
    }
    getEntryNearOrOnTimestamp(timestamp) {
        let timestampsarray = [];
        this.entries.forEach(element => {
            if (element.timestamp === timestamp) {
                return element;
            }
            timestampsarray.push(element.timestamp);
        });
        let closesttime = date_fns_1.closestTo(timestamp, timestampsarray).getTime();
        this.entries.forEach(element => {
            if (element.timestamp === closesttime) {
                return element;
            }
        });
        return undefined;
    }
    getLatestEntry() {
        return this.entries[this.entries.length - 1];
    }
    getEarliestEntry() {
        return this.entries[0];
    }
    on(eventtype, callback) {
        if (this.listeners[eventtype]) {
            throw "Cannot registter second listener for event";
        }
        this.listeners[eventtype] = callback;
    }
}
exports.CommandHistoryRegistry = CommandHistoryRegistry;
class CommandWorker {
    constructor() {
        this.commands = new Map();
    }
    async intializeCommands() {
        var fs = require('fs');
        var files = fs.readdirSync(__dirname + "/commands");
        for (var file of files) {
            let classname = file.split(".")[0].toUpperCase();
            let name = "./commands/" + file.split(".")[0];
            let imported = await Promise.resolve().then(() => require(name));
            let cclass = new imported[classname]();
            this.commands.set(cclass.command, cclass);
        }
    }
    processCommand(json) {
        if (this.commands.has(json.type)) {
            let handler = this.commands.get(json.type);
            let cmdresult = handler.handle(json);
        }
        else {
            return;
        }
    }
}
exports.CommandWorker = CommandWorker;
let cmdworker = new CommandWorker();
cmdworker.intializeCommands();
