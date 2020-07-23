"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthCode = void 0;
const fs_1 = require("fs");
function checkAuthCode(code, callback, ip) {
    fs_1.readFile("auth.json", 'utf8', (err, data) => {
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
                    callback({
                        "authorised": true,
                        "timeleft": timeleft
                    }, ip);
                    return;
                }
                else {
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
exports.checkAuthCode = checkAuthCode;
