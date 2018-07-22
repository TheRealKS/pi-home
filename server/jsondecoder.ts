export interface JsonMessage {
    type : string
}

export interface CommandJsonMessage extends JsonMessage {
    command : string
}

export interface AuthorisationJsonMessage extends JsonMessage {
    code : string
}

export function processMessage(message) {
    let rawjson = <JsonMessage> message;
    switch (rawjson.type) {
        case "command":
            let commandmessage : CommandJsonMessage = <CommandJsonMessage> rawjson;
            return commandmessage;
        case "auth":
            let authmessage : AuthorisationJsonMessage = <AuthorisationJsonMessage> rawjson;
            return authmessage;
        default:
            break;
    }
}
