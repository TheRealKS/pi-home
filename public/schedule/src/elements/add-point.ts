import { LitElement, html, customElement, property, css } from '../../node_modules/lit-element/lit-element';
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

@customElement('add-point')
export class AddPoint extends LitElement {
    
    render() {
        return html`                
            <span class="maintext">Type: Standaard</span>
            ${new DaySelector(false)}
            <span class="maintext">Tijd:</span>
            <input type="time">
            <span class="maintext">Positie</span>
            <input type="number" min="0", max="100">%
            <div class="button_confirm">Toevoegen</div>
        `;
    }

    static get styles() {
        return style;
    }
}