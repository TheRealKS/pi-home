import { promisify } from 'util';
import { readFile, writeFile, watch } from 'fs';
import { TOKENLOCATION, SESSIONTOKENLOCATION } from '../util/constants';
import { Tuple } from '../util/tuple';

interface AuthTokenEntry {
    token : string,
    expires : number
}

interface SessionTokenEntry {
    id : string,
    token : string,
    expires: number
}

export class AuthorisationBroker {

    sessiontokens : Array<SessionTokenEntry>;
    authtokens : Array<AuthTokenEntry>;

    constructor() {
        this.readAuthFile(TOKENLOCATION).then(res => {
            this.authtokens = JSON.parse(res);
        });
        this.readAuthFile(SESSIONTOKENLOCATION).then(res => {
            this.sessiontokens = JSON.parse(res);
        });

        watch(TOKENLOCATION, {}, function(type, nm) {
            this.readAuthFile(SESSIONTOKENLOCATION).then(res => {
                this.sessiontokens = JSON.parse(res);
            });
        }.bind(this));
    }

    checkAuthToken(token : string) : boolean {
        for (var i = 0; i < this.authtokens.length; i++) {
            let element = this.authtokens[i];
            let timeleft = element.expires - (Date.now());
            if (token === element.token && timeleft > 0) {
                this.authtokens.splice(i);
                this.writeChanges();
                return true;
            }
        }
        return false;
    }

    checkSessionToken(token : string, id : string, oldid : string) {
        for (var i = 0; i < this.sessiontokens.length; i++) {
            let element = this.sessiontokens[i];
            let timeleft = element.expires - (Date.now());
            if (token === element.token && timeleft > 0) {
                if (id === element.id) {
                    return new Tuple(timeleft, 0);
                } else if (oldid === element.id) {
                    return new Tuple(timeleft, 1);
                } else {
                    return new Tuple(-1, 2);
                }
            }
        }
        return new Tuple(-1, 2);
    }

    async addSessionToken(data : SessionTokenEntry) {
        let write = promisify(writeFile);
        this.sessiontokens.push(data);
        await write(SESSIONTOKENLOCATION, JSON.stringify(this.sessiontokens));
    }

    private async writeChanges() {
        let write = promisify(writeFile);
        await write(TOKENLOCATION, JSON.stringify(this.authtokens));
    }

    private async readAuthFile(file : string) {
        let prom : any = promisify(readFile);
        try {
            let data : string = await prom(TOKENLOCATION)
            return data;
        } catch (err) {
            console.error(err);
        }
    }
}