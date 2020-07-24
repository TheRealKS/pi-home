import { ICommand } from "../ICommand";
import { CommandResult } from "../commandresult";
import server, { BaseMessage } from "../../server";
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { generateSessionTokenJSON, generateNotAuthorizedJSON } from "../jsongenerator";
import { generateSessionToken } from "../../util/generator";
import { SESSIONTOKENLOCATION, TOKENLOCATION } from "../../util/constants";

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
        let prom = promisify(readFile);
        this.readAuthFile(prom).then(data => {
            let j : Array<any> = JSON.parse(data);
            for (var i = 0; i < j.length; i++) {
                let element = j[i];
                let timeleft = element.expires - (Date.now());
                if (cmddata.token === element.token && timeleft > 0) {
                    let token = generateSessionToken(cmddata.id, timeleft);
                    j.splice(i);
                    this.saveToken(prom, token, cmddata.id, j).then(expiry => server.send(generateSessionTokenJSON(cmddata.id, token, expiry), cmddata.id));
                } else {
                    server.send(generateNotAuthorizedJSON(801), cmddata.id);
                }
            }
        });
        return CommandResult.UNKNOWN;
    }

    async saveToken(func, token, id, authtokendata) {
        let write = promisify(writeFile);
        let expiry = Date.now() + 86400000;
        await func(SESSIONTOKENLOCATION, 'utf-8').then(async data => {
            let j = JSON.parse(data);
                j.push({id: id, token: token, expires: expiry});
                await write(SESSIONTOKENLOCATION, JSON.stringify(j));
        });
        await write(TOKENLOCATION, JSON.stringify(authtokendata));
        return expiry;
    }

    async readAuthFile(func : any) {
        try {
            let data : string = await func(TOKENLOCATION)
            return data;
        } catch (err) {
            console.error(err);
        }
    }
}