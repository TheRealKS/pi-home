import {ListItem} from '../elements/list-item.js';
import {ListItemDay} from '../elements/list-item-day.js';
import { ListItemSwitch } from '../elements/list-item-switch.js';

type ListEL = ListItem | ListItemDay | ListItemSwitch;

export class List {
    element : HTMLElement;

    previousItemCount : number = 0;
    items : Array<ListElement<ListEL>> = [];

    constructor(list : HTMLElement) {
        this.element = list;
    }

    addElement(...args : ListEL[]) {
        this.previousItemCount = this.items.length;
        for (let arg of args) {
            if (!arg) continue;
            this.items.push(<ListElement<ListEL>><unknown>arg);
        }
        this.update();
    }

    clear() {
        this.items = [];
        this.previousItemCount = 0;
        this.update(true);
    }

    private update(redraw = false) {
        if (redraw) {
            this.element.innerHTML = "";
            for (var el of this.items) {
                this.element.appendChild(el.actualElement);
            }
        } else {
            for (var i = this.previousItemCount; i < this.items.length; i++) {
                this.element.appendChild(this.items[i].actualElement);   
            }
        }
    }
}

export class ListElement<Type> { 
    actualElement : Type;

    constructor(el : Type) {
        this.actualElement = el;
    }
}
