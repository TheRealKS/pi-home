export class Logger {
    private enabledValue : boolean;
    constructor(enabled : boolean)  {
        this.enabledValue = enabled;
    }

    enable() {
        this.enabledValue = true;
    }

    disable() {
        this.enabledValue = false;
    }

    log(message : string) {
        if (this.enabledValue)
        console.log(message);
    }

    warn(message : string) {
        if (this.enabledValue)
        console.warn(message);
    }

    error(message : string) {
        if (this.enabledValue)
        console.error(message);
    }

    private sendBackToClient(error : Object) {
        
    }
}