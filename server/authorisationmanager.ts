import { AuthorisationJsonMessage } from './jsondecoder';
import { readFile } from 'fs';

export interface AuthcodeCheckReturnValue {
    authorised : boolean,
    error? : number,
    errordetails? : NodeJS.ErrnoException,
    timeleft? : number
}


export function checkAuthCode(code: AuthorisationJsonMessage, callback : Function, ip) {
    readFile("auth.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            callback({
                "authorised": false,
                "error": 802,
                "errordetails": err
            }, ip);
            return;
        }
        let j = JSON.parse(data);
        for (var i = 0; i < j.length; i++) {
            let element = j[i];
            let timeleft = element.expires - (Date.now() / 1000);
            if (code.code === element.code) {
                if (timeleft > 0) {
                    //Authorised!
                    callback({
                        "authorised": true,
                        "timeleft": timeleft
                    }, ip);
                    return;
                } else {
                    callback({
                        "authorised": false,
                        "error": 801
                    }, ip);
                    return;
                }
            }
        }
        callback({
            "authorised": false,
            "error": 800
        }, ip);
        return;
    });
    return undefined;
}