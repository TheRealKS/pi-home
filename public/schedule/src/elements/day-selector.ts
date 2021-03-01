import { isThisSecond } from 'date-fns';
import { LitElement, html, customElement, property, css } from '../../node_modules/lit-element/lit-element';

const style = css`
.date-picker {
    list-style: none;
    display: inline-block;
    padding: 0;
    margin: 0 auto;
    margin-top: 2vh;
}

.date-picker-item {
    border-radius: 50%;
    border: black 1px solid;
    width: 1em;
    height: 1em;
    padding: 0.5em;
    text-align: center;
    line-height: 1em;
    position: relative;
    float: left;    
    margin-left: 1vw;
    cursor: pointer;
}

.selected {
    background-color: gray;
}

.date-picker-item:hover {
    background-color: gray;
}
.date-picker-item:active {
    background-color: darkgray;
}
`;

const days = ["M", "D", "W", "D", "F", "S", "S"];

@customElement('day-selector')
export class DaySelector extends LitElement {

    private selected : Array<String>;
    private selectid : Number; 
    multiselect : boolean = false;

    constructor(multi : boolean = false, days : Array<Number>) {
        super();
        this.multiselect = multi;
        if (!this.multiselect) {
            if (days.length > 1) {
                throw "Mismatch between parameter multiselect and days";
            } else if (days.length != 0) {
                this.selectid = days[0];
                this.itemClickHandlerSingle.selectid = days[0];
            }
        } else {
            this.selected = days.map(toString);
            this.itemClickHandlerMulti.selected = this.selected;
        }
    }

    render() {
        return html`
            <ul class="date-picker">
                ${days.map((item, i) => html`<li id=${i} @click=${this.multiselect ? this.itemClickHandlerMulti : this.itemClickHandlerSingle} class=${this.isSelected(i) ? "date-picker-item selected" : "date-picker-item"}>${item}</li>`)}
            </ul>
        `;
    }

    getSelected() {
        if (this.multiselect) {
            return this.itemClickHandlerMulti.selected;
        }
        let s = this.itemClickHandlerSingle.selected;
        return [s.id];
    }

    firstUpdated(props) {
        if (!this.multiselect) {
            let elem = this.shadowRoot.getElementById(this.selectid?.toString()) ?? null;
            this.itemClickHandlerSingle.selected = elem;
        }
    }

    private isSelected(id) {
        if (!this.multiselect) {
            return this.selectid == id;
        } else {
            return this.selected.includes(id);
        }
    }

    private itemClickHandlerMulti = {
        selected : null,
        handleEvent(e : MouseEvent) {
            let t = <HTMLElement>e.target;
            if (!this.selected) {
                this.selected = [t.id];
                t.style.backgroundColor = "gray";
            } else {
                if (this.selected.includes(t.id)) {
                    t.style.backgroundColor = "white";
                    this.selected.splice(1, this.selected.indexOf(t.id));
                } else {
                    t.style.backgroundColor = "gray";
                    this.selected.push(t.id);
                }
            }
        },
        capture: true
    }

    private itemClickHandlerSingle = {
        selected : null,
        handleEvent(e : MouseEvent) {
            let t = <HTMLElement>e.target;
            if (this.selected) {
                this.selected.style.backgroundColor = "white";
            }
            this.selected = t;
            t.style.backgroundColor = "gray";
        },
        capture: true
    }

    static get styles() {
        return style;
    }
}