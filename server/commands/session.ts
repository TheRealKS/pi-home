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
 * Create session token
 */
export class SESSION implements ICommand {
    command: string = "SESSION";

    handle(cmddata: SessionCMD): CommandResult {
        let prom = promisify(readFile);
        this.readAuthFile(prom).then(data => {
            let j = JSON.parse(data);
            for (var i = 0; i < j.length; i++) {
                let element = j[i];
                let timeleft = element.expires - (Date.now());
                if (cmddata.token === element.code && timeleft > 0) {
                    let reply = generateAuthorizedJSON(timeleft);
                    if (!server.send(reply, cmddata.id)) {
                        server.replaceID(cmddata.oldid, cmddata.id);
                        server.send(reply, cmddata.id);
                    } 
                    server.setAuthorised(cmddata.id, true);
                } else {
                    server.send(generateNotAuthorizedJSON(802), cmddata.id);
                }
            }
        });
        return CommandResult.UNKNOWN;
    }

    async readAuthFile(func : any) {
        try {
            let data : string = await func(SESSIONTOKENLOCATION)
            return data;
        } catch (err) {
            console.error(err);
        }
    }
}