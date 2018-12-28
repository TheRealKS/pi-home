import { currentstage, Stage } from './editor.js';

export var currentaction;

export function setCurrentAction(newaction) {
    currentaction = newaction;
}

function selectDay(ev) {
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
    if (currentaction && currentstage !== Stage.PROGRAMMES) {
        currentaction.classList.remove("selected");
        while (dom.hasChildNodes()) {
            dom.removeChild(dom.firstChild);
        }
    }
    target.classList.add("selected");
    let template = document.getElementById(target.getAttribute("bind"));
    if (currentstage === Stage.PROGRAMMES) {
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