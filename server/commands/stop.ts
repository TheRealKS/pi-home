import { ICommand } from "../ICommand";
import { CommandResult } from "../commandresult";
import { BaseMessage } from "../../server";
import server from  "../../server";
import { Shutters } from "../../devices/shutters";

interface StopCMD extends BaseMessage {
    //Empty
}

export class STOP implements ICommand {
    command: string = "STOP";

    handle(cmddata: StopCMD): CommandResult {
        let devices = server.getDevices();
        if (devices) {
            let shutters : Shutters = devices["shutters"];
            shutters.stop(false);
            return CommandResult.SUCCESS;
        }
        return CommandResult.ERROR;
    }
}