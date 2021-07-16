import { ProgrammeList } from "./elements/programmes-list";
import { fetchActiveProgramme, fetchProgrammes } from "./scheduleparser";
import { IProgramme } from "./sructure";

window.onload = () => {
    Promise.all([fetchProgrammes(), fetchActiveProgramme()]).then(res => {
        app = new ProgrammeManager(res[0], res[1]);
        app.init();
    });

    document.getElementById("add_bttn").addEventListener("click", () => {
        window.location.href = "/edit.html";
    });
}

export var app : ProgrammeManager;

export class ProgrammeManager {
    private programmes : Array<IProgramme>;
    private active : String

    constructor(programmes : Array<IProgramme>, active : String) {
        this.programmes = programmes;
        this.active = active;
    }

    init() {
        let overview = new ProgrammeList(this.programmes, this.active);
        document.body.appendChild(overview);
    }
}