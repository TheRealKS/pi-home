///<reference path="../editor/fab.js" />

import {Slim} from '../node_modules/slim-js/Slim.js';
import {tag, template} from '../node_modules/slim-js/Decorators.js';
import {Stage, currentstage} from '../editor/editor.js';
import {currentaction, setCurrentAction, selectFabAction} from '../editor/fab.js';

@tag('fab-create')
@template(`
    <div class="newitemcontainer">
        <div class="fab" id="fab">
            <div class="fab_action" s:id="fab_actions">
                <div class="material-icons fab_action_bttn" bind="add_entry_manual">import_export</div>
                <div class="material-icons fab_action_bttn" bind="add_entry_light">brightness_auto</div>
                <div class="material-icons fab_action_bttn" bind="add_entry_event">brightness_medium</div>
            </div>
            <div class="fab_interact">
                <div class="material-icons fab_interact_bttn" s:id="expand_bttn">add</div>
            </div>
        </div>
        <div class="newitem" id="newitem">
        </div>
    </div>
`)
class FabCreate extends Slim {
    onRender() {
        if (currentstage === Stage.PROGRAMMES) {
            this.fab_actions.innerHTML = `
            <div class="material-icons fab_action_bttn selected" bind="add_programme">schedule</div>
            `;
            setCurrentAction(this.fab_actions.firstElementChild);
        }
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
        if (currentstage === Stage.PROGRAMMES) {
            this.fab_actions.firstElementChild.click();
        }
    }
}

Slim.plugin('create', element => {
    if (element.localName === "fab-create") {
        if (currentstage === Stage.PROGRAMMES) {
            element.fab_actions.innerHTML = `
                <div class="material-icons fab_action_bttn selected" bind="add_programme">agenda</div>
            `;
        }
    }
})