import { ICommand } from "../ICommand";
import { CommandResult } from "../commandresult";
import { BaseMessage} from "../../server";
import server from  "../../server";
import { Shutters } from "../../devices/shutters";

interface UpCMD extends BaseMessage {
    //Empty
}

export class UP implements ICommand {
    command : string = "UP";

    handle(cmddata : UpCMD) : CommandResult {
        let devices = server.getDevices();
        if (devices) {
            let shutters : Shutters = devices["shutters"];
            shutters.moveUp();
            return CommandResult.SUCCESS;
        }
        return CommandResult.ERROR;
    }
}