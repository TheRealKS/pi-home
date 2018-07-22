/// <reference path="gpiomanager.ts" />

    export enum State {
        "HIGH" = 1,
        "LOW" = 0
    }

    export class GPIOInstance {
        libraryinstance = null;
        owner : string;
        name : string;

        constructor(libinstance, createdBy : string, name : string) {
            this.libraryinstance = libinstance;
            this.owner = createdBy;
            this.name = name;
        }

        setState(state : State) {
            this.libraryinstance.write(state, err => {
                console.log(err);
            });
        }
        
    }