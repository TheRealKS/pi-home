import Bull = require("bull");
import { Programme } from './programme';
import { ProgrammeRule, StaticProgrammeRule, AutoProgrammeRule } from "./structure/i_programme";
import server from "../server";
import { Shutters } from "../devices/shutters";

const agenda = new Bull('scheduler', 'redis://127.0.0.1:6379');

export class Scheduler {

    private currentProgramme: Programme;

    constructor() {
        agenda.process(function(job, done) {
            this.processJob(job, done);
        }.bind(this));
    }

    loadProgramme(pname: string) {
        Programme.fromJSON("./schedules/" + pname + ".json").then(res => {
            this.currentProgramme = res; 
            this.currentProgramme.content.forEach(val => {
                this.addRule(val);
            });
        });
    }

    getCurrentProgrammeName() {
        return this?.currentProgramme.name;
    }

    async addRule(r: ProgrammeRule) {
        if (this.isStaticRule(r)) {
            if (!r.randomize) {
                const job = await agenda.add(r, { repeat: { cron: r.interval } }).then(job => {
                    console.log("Added: " + job.data);
                });
            } else {
                //TODO: Implement random
                throw "Random not yet supported";
            }
        } else {
            //TODO: Implement auto points
            throw "Auto points not yet supported";
        }
    }

    processJob(j : Bull.Job, done : any) {
        console.log("Processing");
        let job : StaticProgrammeRule = j.data;
        let devices = server.getDevices();
        if (devices) {
            let shutters: Shutters = devices["shutters"];
            if (job.action.pos === 100) {
                //Move down
                shutters.moveDown();
            } else if (job.action.pos === 0) {
                //Move up
                shutters.moveUp();
            } else {
                throw "Unsupported position: " + job.action.pos;
            }
        }
        done();
    }

    private isStaticRule(r: ProgrammeRule): r is StaticProgrammeRule {
        return (r as StaticProgrammeRule).interval !== undefined;
    }
}
