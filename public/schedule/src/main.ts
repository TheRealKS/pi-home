import { fetchProgramme } from "./scheduleparser"
import {OverviewList} from "./elements/overview-list";
import { DetailsBase } from "./elements/details-base";
import { AddPoint } from "./elements/add-point";
import { IProgramme, ProgrammeRule } from "./sructure";
window.onload = () => {
    fetchProgramme("test").then(p => {
       app = new ProgrammeManager(p);
       app.init();
    });

    let circles = new AddPoint();
    let det = new DetailsBase("Schakelpunt Toevoegen", circles);
    document.getElementById("details").appendChild(det);
}

export var app : ProgrammeManager;

export class ProgrammeManager {
    private programme : IProgramme;
    private uiList : OverviewList;
    private edited : boolean = false;

    constructor(p : IProgramme) {
        this.programme = p;

        this.uiList = new OverviewList(p);
    }

    addRule(r : ProgrammeRule) {
        this.programme.content.push(r);
    }

    init() {
        document.getElementById("overview").appendChild(this.uiList);
    }

    update() {
        this.uiList = new OverviewList(this.programme);
        document.getElementById("overview").innerHTML = "";
        this.init();
        
        if (!this.edited) {
            this.edited = true;
        }
    }
}