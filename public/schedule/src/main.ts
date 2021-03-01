import { fetchProgramme } from "./scheduleparser"
import {OverviewList} from "./elements/overview-list";
import { DetailsBase } from "./elements/details-base";
import { AddPoint, FormMode } from "./elements/add-point";
import { IProgramme, ProgrammeRule, StaticProgrammeRule } from "./sructure";
import { parseCronToInputs } from "./cronparser";
import { LitElement } from "../node_modules/lit-element/lit-element";
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

    editRule(index : number) {
        let r = <StaticProgrammeRule>this.programme.content[index];
        let inputs = parseCronToInputs(r.interval);

        let editor = new AddPoint(inputs.t, r.action.pos, inputs.d, FormMode.EDIT);
        this.swapContext(editor, "Schakelpunt Bewerken");
    }

    swapContext(newctx : LitElement, newtitle : string) {
        let det = new DetailsBase(newtitle, newctx);
        document.getElementById("details").innerHTML = "";
        document.getElementById("details").appendChild(det);
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