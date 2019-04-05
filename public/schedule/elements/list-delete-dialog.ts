import { Slim } from '../node_modules/slim-js/Slim.js';
import { tag, template } from '../node_modules/slim-js/Decorators.js';
import { ListItemSwitch } from './list-item-switch.js';

@tag("list-delete-dialog")
@template(`
    <div class="list_item_delete_dialog">
        <i class="material-icons">warning</i>
        Wilt u dit schakelpunt echt verwijderen?
        <div class="list_dialog_bttns">
            <div class="list_dialog_bttn" s:id="confirm">Ja</div>
            <div class="list_dialog_bttn" s:id="decline">Nee</div>
        </div>
    </div>
`)
export class ListDeleteDialog extends Slim {
    associatedElement : ListItemSwitch;

    confirm : Element;
    decline : Element;

    constructor(el : ListItemSwitch) {
        super();
        this.associatedElement = el;
    }

    onRender() {
        this.confirm.addEventListener("click", function(a : ListDeleteDialog) {
            //Stuff to delete
        }.bind(null, this));

        this.decline.addEventListener("click", function(a : ListDeleteDialog) {
            a.associatedElement.dialog = false;
            a.firstElementChild.style.maxHeight = "0vw";
            setTimeout(a.destroy.bind(a), 180);
        }.bind(null, this));
    }
     
    destroy() {
        this.parentNode.removeChild(this);
    }
}