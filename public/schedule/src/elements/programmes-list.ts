import { LitElement, html, customElement, property, css } from '../../node_modules/lit-element/lit-element';
import { IProgramme } from '../sructure';

const style = css`
.list_separator {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 1vw;
    height: 5vh;
    background-color: gray;
    font-weight: 700;
}
`;

@customElement('programmes-list')
export class ProgrammeList extends LitElement {

    @property({ attribute: true })
    programmes: Array<IProgramme>;
    @property({ type: String })
    active: String;

    constructor(p: Array<IProgramme>, a: String) {
        super();
        this.programmes = p;
        this.active = a;
    }

    render() {
        let h = [];
        h.push(html`
            <link rel="stylesheet" href="./css/overview.css">
            <div class="sep_fw list_separator">
                Actief programma
            </div>
        `);

        let otherprogrammes = this.programmes.slice();
        for (var p of this.programmes) {
            if (p.name === this.active) {
                h.push(this.createListEntry(p.name, new Date(p.lastedited).toLocaleString('nl-NL'), false, true));
                otherprogrammes.splice(otherprogrammes.indexOf(p), 1);
                break;
            }
        }

        h.push(html`
        <div class="sep_fw list_separator">
            Andere programma's
        </div>`);

        let k = otherprogrammes.length - 1;
        for (var i = 0; i <= k; i++) {
            let p = otherprogrammes[i];
            h.push(this.createListEntry(p.name, new Date(p.lastedited).toLocaleString('nl-NL'), true));
        }
        return html`${h}`;
    }

    private createListEntry(nm : String, edit : String, border : boolean, active = false) {
        return html`
        <div class="programme_list_entry ${border ? "programme_list_entry_border" : ""}">
            <div class="entry_left">
                <span class="programme_name_l">${nm}</span>
                <span class="programme_edited">Laatst bewerkt: ${edit}</span>
            </div>
            <div p=${nm} class="entry_right">
                <img src="img/edit.svg" class="programme_entry_bttn" @click=${this.edit}/>
                <img src=${active ? "img/highlight_off.svg" : "img/check_circle.svg"} class="programme_entry_bttn" @click=${active ? this.setDeactive : this.setActive}/>
            </div>
        </div>
        `;
    }
    
    private edit(e : MouseEvent) {
        let el = <HTMLElement>e.currentTarget;
        let pname = el.parentElement.getAttribute("p");
        window.location.href = "/edit.html?p=" + pname;
    }
    
    private setDeactive() {
        this.active = undefined;
    }
    
    private setActive(e : MouseEvent) {
        let el = <HTMLElement>e.currentTarget;
        let pname = el.parentElement.getAttribute("p");
        ///TODO: Communicate to the server
        this.active = pname;
    }

    static get styles() {
        return style;
    }
}