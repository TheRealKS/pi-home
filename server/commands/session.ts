import { ICommand } from "../ICommand";
import { CommandResult } from "../commandresult";
import server, { BaseMessage } from "../../server";
import { readFile } from 'fs';
import { promisify } from 'util';
import { generateNotAuthorizedJSON, generateAuthorizedJSON } from "../jsongenerator";
import { SESSIONTOKENLOCATION } from "../../util/constants";

interface SessionCMD extends BaseMessage {
    token : string,
    id : string,
    oldid? : string
}

/**
 * Check session token
 */
export class SESSION implements ICommand {
    command: string = "SESSION";

    handle(cmddata: SessionCMD): CommandResult {
        let broker = server.getAuthBroker();
        let check = broker.checkSessionToken(cmddata.token, cmddata.id, cmddata.oldid); 
        let reply = generateAuthorizedJSON(check.a);
        if (check.b === 0) {
            server.send(reply, cmddata.id);
            server.setAuthorised(cmddata.id, true);
            server.sendWelcome(cmddata.id);
        } else if (check.b === 1) {
            server.replaceID(cmddata.id, cmddata.oldid);
            server.send(reply, cmddata.oldid);
            server.setAuthorised(cmddata.oldid, true);
            server.sendWelcome(cmddata.oldid);
        } else {
            server.send(generateNotAuthorizedJSON(802), cmddata.id);
        }
        return CommandResult.UNKNOWN;
    }
}