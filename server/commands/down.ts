import { ICommand } from "../ICommand";
import { CommandResult } from "../commandresult";
import { BaseMessage} from "../../server";
import server from  "../../server";
import { Shutters } from "../../devices/shutters";

interface DownCMD extends BaseMessage {
    //Empty
}

export class DOWN implements ICommand {
    command : string = "DOWN";

    handle(cmddata : DownCMD) : CommandResult {
        let devices = server.getDevices();
        if (devices) {
            let shutters : Shutters = devices["shutters"];
            shutters.moveDown();
            return CommandResult.SUCCESS;
        }
        return CommandResult.ERROR;
    }
}