import { LitElement, html, customElement, property, css } from '../../node_modules/lit-element/lit-element';
import { IProgramme, StaticProgrammeRule } from '../sructure';
import { isStaticRule, sortProgrammeRules } from '../scheduleparser';
import { materialicons } from './material-icon';
import { app } from '../edit';
import { programmeEmpty } from '../util';

const day = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];

const style = css`
.list_separator {
    display: flex;
    align-items: center;
    width: 49vw;
    padding-left: 1vw;
    height: 5vh;
    background-color: gray;
    font-weight: 700;
}

.list_empty {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.list_item {
    display: grid;
    grid-template-columns: 2.5em calc(35vw - 2.5em) 15vw;
    grid-template-rows: 60% 40%;
    grid-template-areas:
    "icon maintext modify"
    "icon subtext modify";
    padding-top: 2vh;
    padding-bottom: 2vh;
    border-bottom: black solid 1px;
}

.list_item_icon {
    grid-column: icon / icon;
    grid-row: span 2;
    width: 100%;
    font-size: 2.5em;
    align-self: stretch;
    border-right: 1px solid gray;
}
.mod {
    border-right: none;
    height: 0.8em;
    width: 0.8em;
    border-radius: 50%;
    margin-right: 1em;
    padding: 0.2em;
    cursor: pointer;
}
.mod:hover {
    background-color: lightgray;
}
.mod:active {
    background-color: gray;
}

.modify {
    grid-column: modify / modify;
    grid-row: span 2;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    display: flex;
    flex-direction: row;
    align-self: center;
}

.maintext_listitem {
    grid-column: maintext / maintext;
    grid-row: 1;
    margin-left: 2vw;
    font-weight: 400;
    font-size: 1.2em;
}

.subtext_listitem {
    grid-column: maintext / maintext;
    grid-row: 2;
    margin-left: 2vw;
    font-weight: 300;
    font-size: 1em;
}
`;

@customElement('overview-list')
export class OverviewList extends LitElement {

    @property({ attribute: true })
    programme: IProgramme;

    constructor(p: IProgramme) {
        super();
        this.programme = p;
    }

    render() {
        let h = [];
        let sortedprogramme = sortProgrammeRules(this.programme.content);
        if (programmeEmpty(sortedprogramme)) {
            h.push(html`
                <div class="list_empty">
                    Nog geen schakelpunten
                </div>
            `);
        } else {
            for (var i = 0; i < sortedprogramme.length; i++) {
                let rules = sortedprogramme[i];
                if (!rules) continue;
                h.push(html`<span class="list_separator">${day[i]}</span>`);
                rules.forEach((e, j) => {
                    let el = e.rule;
                    if (isStaticRule(el)) {
                        let rule = <StaticProgrammeRule>el;
                        let cron = rule.interval.split(" ");
                        let time = cron[1] + ":" + cron[0];
                        h.push(html`
                        <div class="list_item" index=${i} rule=${e.originalindex}>
                            <img class="list_item_icon" src="img/import_export.svg">
                            <span class="maintext_listitem">${time}</span>
                            <span class="subtext_listitem">${rule.action.pos}%</span>
                            <div class="modify">
                                <img class="list_item_icon mod" src="img/delete.svg" @click=${this.delete}>
                                <img class="list_item_icon mod" src="img/edit.svg" @click=${this.edit}>
                            </div>
                        </div>
                    `);
                    } else {
                        //TODO
                    }
                });
            }
        }
        return html`${h}`;
    }

    delete(event) {
        let conf = confirm("Weet u het zeker!" + this);
        if (conf) {
            let element = <HTMLElement>event.composedPath()[2];
            let rule = element.getAttribute("rule");

            app.deleteRule(parseInt(rule));
        }
    }

    edit(event: MouseEvent) {
        let element = <HTMLElement>event.composedPath()[2];
        let rule = element.getAttribute("rule");

        app.editRule(parseInt(rule));
    }

    static get styles() {
        return [materialicons, style];
    }
}