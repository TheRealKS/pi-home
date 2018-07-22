function createBaseJSON(type : string) {
    return {
        "type": type
    };
}

export function generateAuthorizedJSON(timeleft : number) {
    let o = createBaseJSON("auth");
    o["valid"] = true;
    o["timeleft"] = timeleft;
    return JSON.stringify(o);
}

export function generateNotAuthorizedJSON(error : number, errordetails? : string) {
    let o = createBaseJSON("auth");
    o["valid"] = false;
    o["error"] = error;
    o["errordetails"] = errordetails;
    return JSON.stringify(o);
}