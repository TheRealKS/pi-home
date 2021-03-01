import { LitElement, html, customElement, property, css } from '../../node_modules/lit-element/lit-element';
import { parseInputsToCron } from '../cronparser';
import { app } from '../main';
import { ProgrammeRule, StaticProgrammeRule } from '../sructure';
import { DaySelector } from './day-selector';

const style = css`
.maintext {
    font-weight: bold;
    font-size: 1.5em;
}

.button_confirm {
    background-color: #3F51B5;
    border-radius: 0.5em;
    color: white;
    padding: 0.5em;
    padding-right: 1em;
    padding-left: 1em;
    cursor: pointer;
    border: 1px solid black;
}

.button_confirm:hover {
    background-color: gray;
}

.button_confirm:active {
    background-color: white;
    color: black;
}

`;

export enum FormMode {
    ADD,
    EDIT
}

@customElement('add-point')
export class AddPoint extends LitElement {
    
    private selector : DaySelector;

    @property({type: String})
    private time : String;
    @property({type: Number})
    private pos : Number;
    @property({type: Array})
    private days : Array<Number>;

    private mode : FormMode;

    constructor(time? : String, pos? : Number, days: Array<Number> = [], mode : FormMode = FormMode.ADD) {
        super();
        this.time = time;
        this.pos = pos;
        this.days = days;
    }

    render() {
        this.selector = new DaySelector(false, this.days);
        return html`                
            <span class="maintext">Type: Standaard</span>
            ${this.selector}
            <span class="maintext">Tijd:</span>
            <input type="time" id="time" value="${this.time}">
            <span class="maintext">Positie</span>
            <input id="pos" type="number" min="0", max="100" value="${this.pos}">%
            <div class="button_confirm" @click=${this.add}>${this.mode == FormMode.ADD ? "Toevoegen" : "Wijzigen"}</div>
        `;
    }
    
    private add() {
        //@ts-ignore
        if (!this.selector) {
            alert("Niet alle velden zijn ingevuld!");
            return;
        } 

        var cronrules = parseInputsToCron(this.selector, this.shadowRoot.getElementById("time").value);
        //@ts-ignore
        var pos = parseInt(this.shadowRoot.getElementById("pos").value);
        //@ts-ignore
        for (let r of cronrules) {
            var rule : StaticProgrammeRule = {
                interval : r,
                condition : {},
                action : {pos: pos},
                randomize : false
            };

            app.addRule(rule);
        }
    }

    static get styles() {
        return style;
    }
}