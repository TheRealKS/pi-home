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
            let j = JSON.parse(data);
            for (var i = 0; i < j.length; i++) {
                let element = j[i];
                let timeleft = element.expires - (Date.now());
                if (cmddata.token === element.token && timeleft > 0) {
                    let token = generateSessionToken(cmddata.id, timeleft);
                    delete j[i];
                    let expiry = this.saveToken(token, cmddata.id, j);
                    server.send(generateSessionTokenJSON(cmddata.id, token, expiry), cmddata.id);
                } else {
                    server.send(generateNotAuthorizedJSON(801), cmddata.id);
                }
            }
        });
        return CommandResult.UNKNOWN;
    }

    saveToken(token, id, authtokendata) {
        readFile(SESSIONTOKENLOCATION, 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                let j = JSON.parse(data);
                j.push({id: id, token: token, expires: Date.now() + 86400000});
                writeFile(SESSIONTOKENLOCATION, JSON.stringify(j), err => console.error(err));
            }
        });
        writeFile(TOKENLOCATION, JSON.stringify(authtokendata), err => console.error(err));
        return Date.now() + 86400000;
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