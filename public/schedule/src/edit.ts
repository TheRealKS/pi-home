import { createEmptyProgramme, fetchProgramme } from "./scheduleparser"
import {OverviewList} from "./elements/overview-list";
import { DetailsBase } from "./elements/details-base";
import { AddPoint, FormMode } from "./elements/add-point";
import { IProgramme, ProgrammeRule, StaticProgrammeRule } from "./sructure";
import { parseCronToInputs } from "./cronparser";
import { LitElement } from "../node_modules/lit-element/lit-element";

var editing = false;

window.onload = () => {
    let query = new URLSearchParams(window.location.search);
    let p = query.get('p');
    if (p) {
        fetchProgramme("test").then(p => {
            app = new ProgrammeEditor(p);
            app.init();
        });
    } else {
        app = new ProgrammeEditor(null);
        app.init();
    }

    document.getElementById("add_bttn").addEventListener("click", () => {
        let circles = new AddPoint();
        app.swapContext(circles, "Schakelpunt Toevoegen")
    });

    document.getElementById("save_bttn").addEventListener("click", () => {
        //Add save Routine
    });

    document.getElementById("programme_name").addEventListener("dblclick", () => {
        editing = true;
        let el = document.getElementById("programme_name");
        el.innerHTML = "Programma: <input type='text' value='" + el.innerHTML.split(" ")[1] + "'/>";
    });

    document.body.addEventListener("click", (event : MouseEvent) => {
        if (editing && event.target.parentNode.id != "programme_name") {
            let nm = document.getElementById("programme_name");
            let name = nm.childNodes[1].value;
            nm.innerHTML = "Programma: " + name;
            app.editProgrammeName(name);
            editing = false;
        }
    })
}

export var app : ProgrammeEditor;

export class ProgrammeEditor {
    private programme : IProgramme;
    private uiList : OverviewList;
    private edited : boolean = false;

    private currentContext;

    constructor(p : IProgramme) {
        if (p) {
            this.programme = p;
            this.uiList = new OverviewList(p);
        } else {
            this.programme = createEmptyProgramme();
            this.uiList = new OverviewList(this.programme);
            editing = true;
            let el = document.getElementById("programme_name");
            el.innerHTML = "Programma: <input id='name_edit' type='text' value='" + el.innerHTML.split(" ")[1] + "'/>";
            document.getElementById('name_edit').focus();
        }
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

    editProgrammeName(nm : string) {
        this.programme.name = nm;
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