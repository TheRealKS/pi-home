///<reference path="../editor/fab.js" />

import {Slim} from '../node_modules/slim-js/Slim.js';
import {tag, template} from '../node_modules/slim-js/Decorators.js';
import {Stage, fabmanager, currentaction, setCurrentAction, selectFabAction} from '../editor/fab.js';
import { FabManager } from '../editor/fab.js';
import { initializeFab } from '../editor/fab.js';

@tag('fab-create')
@template(`
    <div class="newitemcontainer">
        <div class="fab" id="fab">
            <div class="fab_action" s:id="fab_actions">
                <div class="material-icons fab_action_bttn selected" bind="add_programme">calendar_today</div>
            </div>
            <div class="fab_interact">
                <div class="material-icons fab_interact_bttn" s:id="expand_bttn">add</div>
            </div>
        </div>
        <div class="newitem" id="newitem">
        </div>
    </div>
`)
export class FabCreate extends Slim {
    created : boolean = false;
    fab_actions : HTMLElement;
    expand_bttn : HTMLElement;
    onRender() {
        this.expand_bttn.addEventListener('click', (ev) => {
            if (!currentaction) {
                return;
            }
            ev.target.parentNode.classList.toggle("middle");
            ev.target.classList.toggle("rotate");
            document.getElementsByClassName("newitemcontainer")[0].classList.toggle("expanded");
        });
        let children : Array<Element> = <Array<Element>><unknown>this.fab_actions.children;
        for (var child of children) { 
            child.addEventListener('click', selectFabAction);
        }
        if (!this.created) {
            this.created = true;
            setCurrentAction(this.fab_actions.firstElementChild);
            initializeFab(this);
        }
    }

    reRender(elements : Array<HTMLElement>) {   
        this.fab_actions.innerHTML ="";
        for (var e of elements) {
            this.fab_actions.appendChild(e);
        }
        this.onRender();
    }
}

Slim.plugin('create', element => {
    if (element.localName === "fab-create") {
        if (fabmanager.currentstage === Stage.PROGRAMMES) {
            element.fab_actions.innerHTML = `
                <div class="material-icons fab_action_bttn selected" bind="add_programme">agenda</div>
            `;
        }
    }
})