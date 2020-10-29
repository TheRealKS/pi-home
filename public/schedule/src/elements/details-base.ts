import { LitElement, html, customElement, property, css } from '../../node_modules/lit-element/lit-element';
import { IProgramme, StaticProgrammeRule } from '../sructure';
import { isStaticRule, sortProgrammeRules } from '../scheduleparser';

const style = css`
`;

@customElement('details-base')
export class DetailsBase extends LitElement {
    
    @property({attribute: false})
    programme : IProgramme;

    constructor(p : IProgramme) {
        super();
        this.programme = p;
    }
    
    render() {
        let h = [];
        h.push(html`<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Sharp" rel="stylesheet">`);
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
                            <span class="material-icons-sharp list_item_icon">import_export</span>
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
        return style;
    }
}