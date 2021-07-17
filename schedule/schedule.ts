import Bull = require("bull");
import { Programme } from './programme';
import { ProgrammeRule, StaticProgrammeRule, AutoProgrammeRule } from "./structure/i_programme";
import server from "../server";
import { Shutters } from "../devices/shutters";
import { State } from "./state";

const agenda = new Bull('scheduler', 'redis://127.0.0.1:6379');

export class Scheduler {

    private currentProgramme: Programme;
    private previousState : State;

    constructor() {
        agenda.process(function(job, done) {
            this.processJob(job, done);
        }.bind(this));
    }

    async shutdown() {
        //@ts-ignore
        await agenda.obliterate({force:true});
    }

    async loadProgramme(pname: string) {
        await agenda.empty();
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

    async getNextRule() {
        let jobs = await agenda.getWaiting();
        if (jobs.length > 0) {
            return jobs[0];
        }
        throw "No other jobs";
    }

    async skipNext() {
        try {
            let next = await this.getNextRule();
            await agenda.removeJobs(next.id.toString());
            return true;
        } catch (e) {
            throw e;
        }
    }

    getPrevState() {
        if (this.previousState) {
            return this.previousState;
        }
        throw "No previous state";
    }

    revertToPrevState() {
        if (this.previousState) {
            let devices = server.getDevices();
            if (devices) {
                let shutters : Shutters = devices["shutters"];
                if (shutters.getCurrentPosition() != this.previousState.pos) {
                    if (this.previousState.pos === 100) {
                        //Move down
                        shutters.moveDown();
                    } else if (this.previousState.pos === 0) {
                        //Move up
                        shutters.moveUp();
                    }
                }
                return true;
            }
        }
        return false;
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
            this.previousState = {pos: shutters.getCurrentPosition(), changedby: job};
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
