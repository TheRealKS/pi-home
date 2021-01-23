import { LitElement, html, customElement, property, css } from '../../node_modules/lit-element/lit-element';

const style = css`
.x {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.x > * {
    padding-top: 2vh;
}

.list_separator {
    display: flex;
    align-items: center;
    width: 49vw;
    padding-left: 1vw;
    height: 5vh;
    background-color: gray;
    font-weight: 700;
    margin-bottom: 2vh;
}

`;

@customElement('details-base')
export class DetailsBase extends LitElement {
    
    @property({type: String})
    header : string;

    c: LitElement;

    constructor(h : string, content : LitElement) {
        super();
        this.header = h;
        this.c = content;
        this.c.classList.add("x");
    }
    
    render() {
        return html`                
        <span class="list_separator">${this.header}</span>
        ${this.c}
        `;
    }

    static get styles() {
        return style;
    }
}