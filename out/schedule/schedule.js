"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
var schedule = require('node-schedule');
class Schedule {
    constructor() {
        this.schedules = [];
    }
    scheduleJob(recurrence, jobfunction) {
        let job = schedule.scheduleJob(recurrence, jobfunction);
        this.schedules.push(job);
    }
    cancelJob(id) {
        if (this.schedules[id] !== void 0) {
            this.schedules[id].jobobject.cancel();
        }
    }
    rescheduleJob(id, newRecurrence) {
        if (this.schedules[id] !== void 0) {
            this.schedules[id].jobobject.reschedule(newRecurrence);
        }
    }
    skipJob(id) {
        if (this.schedules[id] !== void 0) {
            this.schedules[id].jobobject.cancelNext();
        }
    }
}
exports.Schedule = Schedule;
