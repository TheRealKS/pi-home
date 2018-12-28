/// <reference types="node-schedule" />

import { Job, RecurrenceRule } from "node-schedule";

var schedule = require('node-schedule');

export interface ScheduledJob {
    scheduledon : number,
    jobobject : Job
}

export class Schedule {

    schedules : ScheduledJob[] = [];

    scheduleJob(recurrence : RecurrenceRule, jobfunction : Function) {
        let job = schedule.scheduleJob(recurrence, jobfunction);
        this.schedules.push(job);
    }

    cancelJob(id : number) {
        if (this.schedules[id] !== void 0) {
            this.schedules[id].jobobject.cancel();
        }
    }

    rescheduleJob(id: number, newRecurrence : RecurrenceRule) {
        if (this.schedules[id] !== void 0) {
            this.schedules[id].jobobject.reschedule(newRecurrence);
        }
    }

    skipJob(id : number) {
        if (this.schedules[id] !== void 0) {
            this.schedules[id].jobobject.cancelNext();
        }
    }
}
