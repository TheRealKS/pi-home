import { LitElement, html, customElement, property, css } from '../../node_modules/lit-element/lit-element';
import { IProgramme, StaticProgrammeRule } from '../sructure';
import { isStaticRule, sortProgrammeRules } from '../scheduleparser';
import { materialicons } from './material-icon';

const day = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

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

.list_item {
    display: grid;
    grid-template-columns: 2.5em calc(50vw - 2.5em);
    grid-template-rows: 60% 40%;
    grid-template-areas:
    "icon maintext"
    "icon subtext";
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

.maintext_listitem {
    margin-left: 2vw;
    font-weight: 400;
    font-size: 1.2em;
}

.subtext_listitem {
    margin-left: 2vw;
    font-weight: 300;
    font-size: 1em;
}
`;

@customElement('overview-list')
export class OverviewList extends LitElement {
    
    @property({attribute: false})
    programme : IProgramme;

    constructor(p : IProgramme) {
        super();
        this.programme = p;
    }
    
    render() {
        let h = [];
        let sortedprogramme = sortProgrammeRules(this.programme.content);
        for (var i = 0; i < sortedprogramme.length; i++) {
            let rules = sortedprogramme[i];
            if (!rules) continue;
            h.push(html`<span class="list_separator">${day[i]}</span>`);
            rules.forEach(el => {
                if (isStaticRule(el)) {
                    let rule = <StaticProgrammeRule>el;
                    let cron = rule.interval.split(" ");
                    let time = cron[1] + ":" + cron[0];
                    h.push(html`
                        <div class="list_item">
                            <span class="material-icons list_item_icon">import_export</span>
                            <span class="maintext_listitem">${time}</span>
                            <span class="subtext_listitem">${rule.action.pos}</span>
                        </div>
                    `);
                } else {
                    //TODO
                }
            });
        }
        return html`${h}`;
    }

    static get styles() {
        return [materialicons, style];
    }
}