import { ICommand } from "../ICommand";
import { CommandResult } from "../commandresult";
import server, { BaseMessage } from "../../server";
import { generateSessionTokenJSON, generateNotAuthorizedJSON } from "../jsongenerator";
import { generateSessionToken } from "../../util/generator";

interface AuthCMD extends BaseMessage {
    token : string,
    id : string
}

/**
 * Create session token
 */
export class AUTH implements ICommand {
    command: string = "AUTH";

    handle(cmddata: AuthCMD): CommandResult {
        let broker = server.getAuthBroker();
        if (broker.checkAuthToken(cmddata.token)) {
            let token = generateSessionToken(cmddata.id, Date.now());
            let expiry = Date.now() + 86400000;
            let sestoken = generateSessionTokenJSON(cmddata.id, token, expiry);
            broker.addSessionToken({id: cmddata.id, token: token, expires: expiry});
            server.send(sestoken, cmddata.id);
        } else {
            server.send(generateNotAuthorizedJSON(801), cmddata.id);
        }
        return CommandResult.UNKNOWN;
    }
}