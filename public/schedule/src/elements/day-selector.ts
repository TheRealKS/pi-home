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

.date-picker-item:hover {
    background-color: gray;
}
.date-picker-item:active {
    background-color: darkgray;
}
`;

@customElement('day-selector')
export class DaySelector extends LitElement {

    private selected = null;

    render() {
        let days = ["M", "D", "W", "D", "F", "S", "S"];
        
        return html`
            <ul class="date-picker">
                ${days.map((item) => html`<li @click=${this.itemClickHandler} class="date-picker-item">${item}</li>`)}
            </ul>
        `;
    }

    getSelected() {
        return this.selected.innerHTML;
    }

    private itemClickHandler = {
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