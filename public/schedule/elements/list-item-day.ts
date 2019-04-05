import {Slim} from '../node_modules/slim-js/Slim.js';
import {tag, template} from '../node_modules/slim-js/Decorators.js';

var days = {
    mon : "Maandag",
    tue : "Dinsdag",
    wed : "Woensdag",
    thu : "Donderdag",
    fri : "Vrijdag",
    sat : "Zaterdag",
    sun : "Zondag"
};

@tag('list-item-day')
@template(`
    <div class="list_item">
        <div>
            <span class="list_item_title" name="list_item_title" bind>{{name}}</span><br>
            <span class="list_item_caption" name="list_item_caption" bind>{{entries}}</span>
        </div>
    </div>
`)
export class ListItemDay extends Slim {
    name : string;
    numofentries : number;
    entries : string;
    constructor(name, entries) {
        super();
        this.name = this.getDayString(name);
        this.numofentries = entries;
        this.entries = this.getEntriesString(entries);
    }

    getDayString(day) {
        return days[day];
    }

    getEntriesString(entries) : string {
        if (entries === 0) {
            return "Geen schakelpunten";
        } else if (entries === 1) {
            return "1 schakelpunt";
        } else {
            return entries.toString() + " schakelpunten";
        }
    }
}