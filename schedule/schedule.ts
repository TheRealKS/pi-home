import Agenda = require("agenda");
import { Programme } from './programme';
import { ProgrammeRule, StaticProgrammeRule, AutoProgrammeRule } from "./structure/i_programme";

const mongoConnectionString = 'mongodb://127.0.0.1/agenda';

const agenda = new Agenda({db: {address: mongoConnectionString}});

class Scheduler {

    currentProgramme : Programme;
    
    constructor() {

    }

    loadProgramme(pname : string) {
        Programme.fromJSON("../schedules/" + pname + ".json").then(res => {this.currentProgramme = res});
    }

    addRule(r : ProgrammeRule) {
        if (this.isStaticRule(r)) {
            if (!r.randomize) {
                agenda.define("Job!", job => {
                    
                })
            } else {
                //TODO: Implement random
            }
        } else {

        }
    }

    private isStaticRule(r : ProgrammeRule) : r is StaticProgrammeRule {
        return (r as StaticProgrammeRule).interval !== undefined;
    }
}
