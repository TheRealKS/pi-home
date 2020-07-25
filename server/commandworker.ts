import {
    closestTo
} from "date-fns";
import { ICommand } from "./ICommand";
import { BaseMessage } from "../server";
import { CommandResult } from "./commandresult";

export class CommandWorker {

    commands : Map<string, ICommand> = new Map();

    constructor() {

    }

    /**
     * Initialises all commands from the command directory (./commands)
     */
    async intializeCommands() {
        var fs = require('fs');
        var files = fs.readdirSync(__dirname + "/commands");
        for (var file of files) {
            let classname = file.split(".")[0];
            let name = "./commands/" + classname;
            let imported = await import(name);
            let cclass : ICommand = new imported[classname.toUpperCase()]();
            this.commands.set(cclass.command, cclass);
        }
    }

    /**
     * Process a command
     * @param json the json message as received
     */
    processCommand(json : BaseMessage) {
        if (this.commands.has(json.type)) {
            let handler : ICommand = this.commands.get(json.type);
            let cmdresult : CommandResult = handler.handle(json);
        } else {
            return 
        }
    }
}