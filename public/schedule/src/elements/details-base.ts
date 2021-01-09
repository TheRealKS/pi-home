import { LitElement, html, customElement, property, css } from '../../node_modules/lit-element/lit-element';

const style = css`
.details-content {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.details-content > * {
    padding-top: 2vh;
}

::slotted(*) {
    padding-top: 2vh;
}

.maintext {
    font-weight: bold;
    font-size: 1.5em;
}

.list_separator {
    display: flex;
    align-items: center;
    width: 49vw;
    padding-left: 1vw;
    height: 5vh;
    background-color: gray;
    font-weight: 700;
}

`;

@customElement('details-base')
export class DetailsBase extends LitElement {
    
    @property({type: String})
    header : string;

    constructor(h : string) {
        super();
        this.header = h;
    }
    
    render() {
        return html`                
        <span class="list_separator">${this.header}</span>
        <div class="details-content">
            <slot></slot>
        </div>
        `;
    }

    static get styles() {
        return style;
    }
}