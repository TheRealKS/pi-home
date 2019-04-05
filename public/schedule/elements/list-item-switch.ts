import { Slim } from '../node_modules/slim-js/Slim.js';
import { tag, template } from '../node_modules/slim-js/Decorators.js';
import { ProgrammeManager } from '../editor/programmemanager.js';
import { ListDeleteDialog } from './list-delete-dialog.js';

@tag("list-item-switch")
@template(`
    <div class="list_item list_item_wicon">
        <i class="material-icons list_item_icon_nofunc" bind>{{icon}}</i>
        <div>
            <span class="list_item_title" name="list_item_title" bind>{{title}}</span><br>
            <span class="list_item_caption" name="list_item_caption" bind>{{caption}}</span>
        </div>
        <div class="list_item_actions_alt">
            <i class="material-icons list_item_icon" s:id="edit_bttn">edit</i>
            <i class="material-icons list_item_icon red_hover" s:id="delete_bttn">delete</i>
        </div>
    </div>
`)
export class ListItemSwitch extends Slim {
    icon : string;
    title : string;
    caption : string;

    edit_bttn : Element;
    delete_bttn : Element;

    manager : ProgrammeManager;

    dialog : boolean = false;

    constructor(man : ProgrammeManager, icon : string, title : string, caption : string) {
        super();
        this.icon = icon;
        this.title= title;
        this.caption = caption;
        this.manager = man;
    }

    onRender() {
        this.edit_bttn.addEventListener("click", () => {
            console.log("edit");
        });

        this.delete_bttn.addEventListener("click", () => {
            if (!this.dialog) {
                this.dialog = true;
                let dialog = new ListDeleteDialog(this);
                this.after(dialog);
                setTimeout(function() {this.firstElementChild.style.maxHeight = "5vw";}.bind(dialog), 1);
            }
        });
    }
}