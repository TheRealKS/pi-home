import Agenda = require("agenda");
import { Programme } from './programme';
import { ProgrammeRule, StaticProgrammeRule, AutoProgrammeRule } from "./structure/i_programme";
import server from  "../server";
import { Shutters } from "../devices/shutters";
import { shake128 } from "js-sha3";

const mongoConnectionString = 'mongodb://127.0.0.1/agenda-testcd';

const agenda = new Agenda({db: {address: mongoConnectionString}});

export class Scheduler {

    private currentProgramme : Programme;

    loadProgramme(pname : string) {
        Programme.fromJSON("../schedules/" + pname + ".json").then(res => {this.currentProgramme = res});
        this.currentProgramme.content.forEach(val => {
            this.addRule(val);
        });
    }

    getCurrentProgrammeName() {
        return this?.currentProgramme.name;
    }

    addRule(r : ProgrammeRule) {
        let jobname = shake128(JSON.stringify(r), 64);
        if (this.isStaticRule(r)) {
            if (!r.randomize) {
                //TODO: Implement proper system
                agenda.define(jobname, job => {
                    let devices = server.getDevices();
                    if (devices) {
                        let shutters : Shutters = devices["shutters"];
                        if (r.action.pos === 100) {
                            //Move down
                            shutters.moveDown();
                        } else if (r.action.pos === 0) {
                            //Move up
                            shutters.moveUp();
                        } else {
                            throw "Unsupported position: " + r.action.pos;
                        }
                    }
                });
                agenda.every(r.interval, jobname);
            } else {
                //TODO: Implement random
                throw "Random not yet supported";
            }
        } else {
            //TODO: Implement auto points
            throw "Auto points not yet supported";
        }
    }

    private isStaticRule(r : ProgrammeRule) : r is StaticProgrammeRule {
        return (r as StaticProgrammeRule).interval !== undefined;
    }
}
