import { ICommand } from "../ICommand";
import { CommandResult } from "../commandresult";
import { BaseMessage } from "../../server";

interface UpCMD extends BaseMessage {
    //Empty
}

export class Up implements ICommand {
    command : string = "UP";
    
    constructor() {
        //Something about GPIO
    }

    handle(cmddata : UpCMD) : CommandResult {
        return null;
    }
}