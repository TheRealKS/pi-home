/// <reference path="gpiomanager.ts" />

import { Mode, InterruptEdge } from "./gpiomanager";

    export enum State {
        "HIGH" = 1,
        "LOW" = 0
    }

    export class GPIOInstance {
        libraryinstance = null;
        owner : string;
        name : string;
        type : Mode;
        edge : InterruptEdge;

        constructor(libinstance, createdBy : string, name : string, mode : Mode, edge? : InterruptEdge) {
            this.libraryinstance = libinstance;
            this.owner = createdBy;
            this.name = name;
            this.type = mode;
            if (edge) {
                this.edge = edge;
                this.libraryinstance.setEdge(edge);
            }
        }

        setState(state : State) {
            this.libraryinstance.write(state, err => {
                if (err)
                console.log(err);
            });
        }

        setEdge(edge : InterruptEdge) : InterruptEdge {
            if (this.type == Mode.OUTPUT) {
                throw "Cannot set an interrupt edge for an output gpio instance";            
            }
            this.libraryinstance.setEdge(edge);
            let backup = this.edge;
            this.edge = edge;
            return backup;
        }

        addWatcher(c : Function) {
            if (this.type == Mode.OUTPUT) {
                throw "Cannot register a watcher for an output gpio instance";
            }
            if (!this.edge) {
                this.setEdge(InterruptEdge.RISING_EDGE);
            }
            this.libraryinstance.watch(c);
            this.libraryinstance.watch((er, val) => {
                //console.log(val);
            });
            return this.libraryinstance;
        } 
    }