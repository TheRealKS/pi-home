import { AuthorisationJsonMessage } from './jsondecoder';
import { readFile } from 'fs';

export interface AuthcodeCheckReturnValue {
    authorised : boolean,
    error? : number,
    errordetails? : NodeJS.ErrnoException,
    timeleft? : number
}


export function checkAuthCode(code: AuthorisationJsonMessage, callback : Function, ip) {
    readFile("auth.json", (err, data) => {
        if (err) {
            console.error(err);
            callback({
                "authorised": false,
                "error": 802,
                "errordetails": err
            }, ip);
            return;
        }
        let j = data.toJSON().data;
        for (var i = 0; i < j.length; i++) {
            let element = j[i];
            let timeleft = element.expires - Date.now();
            if (code === element.code) {
                if (timeleft > 0) {
                    //Authorised!
                    callback({
                        "authorised": true,
                        "timeleft": timeleft
                    }, ip);
                } else {
                    callback({
                        "authorised": false,
                        "error": 801
                    }, ip);
                }
            }
        }
        callback({
            "authorised": false,
            "error": 800
        }, ip);
    });
    return undefined;
}