import {Slim} from '../node_modules/slim-js/Slim.js';
import {tag, template} from '../node_modules/slim-js/Decorators.js';

@tag('list-item')
@template(`
    <div class="list_item">
        <div>
            <span class="list_item_title" name="list_item_title" bind>{{name}}</span><br>
            <span class="list_item_caption" name="list_item_caption" bind>{{days}}</span>
        </div>
        <i class="material-icons list_item_icon selected" no_event_prop>done</i>
    </div>
`)
export class ListItem extends Slim {
    name : string;
    days : string;
    constructor(name, days) {
        super();
        this.name = name;   
        this.days = days;
    }
}