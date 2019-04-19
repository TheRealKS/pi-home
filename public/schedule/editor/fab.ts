import { submitForm } from './editor.js';
import { FabCreate } from '../elements/fab.js';

export enum Stage {
    PROGRAMMES,
    PROGRAMME,
    DAY
}

export var currentaction;

export var fabmanager : FabManager;

export class FabManager {

    el : FabCreate;
    currentstage : Stage;

    constructor() {
        this.currentstage = Stage.PROGRAMMES;
    }

    ready(e : FabCreate) {
        this.el = e;
        this.el.fab_actions.firstElementChild.click();
    }

    selectStage(s : Stage) {
        if (s !== this.currentstage) {
            this.currentstage = s;
            this.el.reRender(createFabActions(s));
        }
    }
}

export function initializeFab(e : FabCreate) {
    fabmanager = new FabManager();
    fabmanager.ready(e);
}

export function setCurrentAction(newaction) {
    currentaction = newaction;
}

export function selectDay(ev) {
    let target = ev.target;
    if (!target.hasAttribute("selected")) {
        target.setAttribute("selected", "true");
        target.classList.add("selected");
    } else {
        target.removeAttribute("selected");
        target.classList.remove("selected");
    }
}

export function selectFabAction(ev) {
    let dom = document.getElementById("newitem");
    let target = ev.target;
    if (currentaction && fabmanager.currentstage !== Stage.PROGRAMMES) {
        currentaction.classList.remove("selected");
        while (dom.hasChildNodes()) {
            dom.removeChild(dom.firstChild);
        }
    }
    target.classList.add("selected");
    let template = document.getElementById(target.getAttribute("bind"));
    if (fabmanager.currentstage === Stage.PROGRAMMES) {
        while (dom.hasChildNodes()) {
            dom.removeChild(dom.firstChild);
        }
        template = document.getElementById("add_programme");
    }
    dom.appendChild(template.content.cloneNode(true));
    currentaction = target;
}

function deselectFabActions() {
    if (currentaction) {
        currentaction.classList.remove("selected");
    }
    currentaction = undefined;
}

function createFabActions(s : Stage) {
    switch (s) {
        case Stage.PROGRAMMES:
            let o = document.createElement("div");
            o.classList.add("material-icons", "fab_action_bttn");
            o.setAttribute("bind", "add_programme");
            o.innerHTML = "calendar_today";
            return [o];
        case Stage.PROGRAMME:
            let b = document.createElement("div");
            b.classList.add("material-icons", "fab_action_bttn");
            b.setAttribute("bind", "add_day");
            b.innerHTML = "today";
            return [b];
        case Stage.DAY:
            return createDayFabActions();
        default:
            return Array();    
    }
}

function createDayFabActions() {
    let a = document.createElement("div");
    a.classList.add("material-icons", "fab_action_bttn");
    a.setAttribute("bind", "add_entry_manual");
    a.innerHTML = "import_export";
    let b = document.createElement("div");
    b.classList.add("material-icons", "fab_action_bttn");
    b.setAttribute("bind", "add_entry_auto");
    b.innerHTML = "autorenew";
    let c = document.createElement("div");
    c.classList.add("material-icons", "fab_action_bttn");
    c.setAttribute("bind", "add_entry_sensor");
    c.innerHTML = "brightness_auto";

    return [a, b, c];
}