import {Slim} from '../node_modules/slim-js/Slim.js';
import {tag, template} from '../node_modules/slim-js/Decorators.js';
import {selectDay} from "../editor/fab.js";

@tag('add-entry-man')
@template(`
    <h1>Nieuw schakelpunt - Positie</h1>
    <span class="label">Op tijdstip:</span><span class="timedisplay">33:33</span><br>
    <span class="label">Ga naar:</span><span class="timedisplay">80%</span><br>
    <span class="lable">Doe dit op:</span>
    <div class="days" id="days">
        <div class="timedisplay fab_action_bttn">m</div>
        <div class="timedisplay fab_action_bttn">di</div>
        <div class="timedisplay fab_action_bttn">w</div>
        <div class="timedisplay fab_action_bttn">do</div>
        <div class="timedisplay fab_action_bttn">v</div>
        <div class="timedisplay fab_action_bttn">za</div>
        <div class="timedisplay fab_action_bttn">zo</div>
    </div><br>
    <span class="label">Met willekeurige vertraging binnen</span><span class="timedisplay">10 minuten</span>
    <!--Some button--!>
`)
export class AddEntryManual extends Slim {
    
    onRender() {
        var els = this.getElementsByClassName("timedisplay");
        for (var i = 0; i < els.length; i++) {
            els[i].addEventListener("click", selectDay);
        }
    }
}