import { fetchProgrammes } from "./scheduleparser";

window.onload = () => {
    fetchProgrammes().then(p => {
       app = new ProgrammeManager(p);
       app.init();
    });
}

export var app : ProgrammeManager;

export class ProgrammeManager {
}