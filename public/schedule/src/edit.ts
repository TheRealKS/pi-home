import { fetchProgramme } from "./scheduleparser"
import {OverviewList} from "./elements/overview-list";
import { DetailsBase } from "./elements/details-base";
import { AddPoint, FormMode } from "./elements/add-point";
import { IProgramme, ProgrammeRule, StaticProgrammeRule } from "./sructure";
import { parseCronToInputs } from "./cronparser";
import { LitElement } from "../node_modules/lit-element/lit-element";
import { computeRuleSignature } from "./util";
window.onload = () => {
    fetchProgramme("test").then(p => {
       app = new ProgrammeEditor(p);
       app.init();
    });

    document.getElementById("add_bttn").addEventListener("click", () => {
        let circles = new AddPoint();
        app.swapContext(circles, "Schakelpunt Toevoegen")
    });

    document.getElementById("save_bttn").addEventListener("click", () => {
        //Add save Routine
    });
}

export var app : ProgrammeEditor;

export class ProgrammeEditor {
    private programme : IProgramme;
    private uiList : OverviewList;
    private edited : boolean = false;

    private currentContext;

    constructor(p : IProgramme) {
        this.programme = p;

        this.uiList = new OverviewList(p);
    }

    addOrEditRule(r : ProgrammeRule) {
        for (var i = 0; i < this.programme.content.length; i++) {
            let rule = this.programme.content[i];
            if (rule.id == r.id) {
                this.programme.content[i] = r;
                this.uiList.requestUpdate();
                return;
            }
        }
        this.programme.content.push(r);
    }

    getNextRuleID() {
        return this.programme.content.length;
    }

    editRule(index : number) {
        let r = <StaticProgrammeRule>this.programme.content[index];
        let inputs = parseCronToInputs(r.interval);

        let editor = new AddPoint(inputs.t, r.action.pos, inputs.d, r.id, FormMode.EDIT);
        this.swapContext(editor, "Schakelpunt Bewerken");
    }
    
    deleteRule(index : number) {
        this.programme.content.splice(index, 1);
        this.uiList.requestUpdate();
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