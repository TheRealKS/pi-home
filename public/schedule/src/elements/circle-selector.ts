import { isThisISOWeek } from 'date-fns';
import { LitElement, html, customElement, property, css, eventOptions } from '../../node_modules/lit-element/lit-element';

const style = css`
.circle-selector {
    display: flex;
    align-items: center;
}

.circle-select {
    border: 1px solid black;
    border-radius: 50%;
    font-size: 1.5em;
    width: 1.7em;
    height: 1.7em;
    text-align: center;
    line-height: 1.7em;
    margin-right: 1vw;
}

.circle-select-selected {
    background-color: gray;
}
`;

export interface CircleSelector {
    title : string;
}

@customElement('circle-selector')
export class CircleSelector extends LitElement {
    
    @property({type: Array})
    titles : Array<string>;
    
    selected : string;

    constructor(titles : Array<string>) {
        super();
        this.titles = titles;
    }

    render() {
        return html`                
        <div class="circle-selector">
        ${this.titles.map(i => html`<div @click="${this.handleClick}" class="circle-select">${i}</div>`)}
        </div>
        `;
    }

    private handleClick(e : MouseEvent) {
        let dispatcher = <HTMLElement>e.target;
        if (this?.selected !== dispatcher.innerHTML) {
            dispatcher.classList.toggle("circle-select-selected");
            for (let c of this.shadowRoot.children[0].children) {
                if (c.innerHTML == this.selected) {
                    c.classList.toggle("circle-select-selected");
                }
            }
            this.selected = dispatcher.innerHTML;
        }
    }

    static get styles() {
        return style;
    }
}