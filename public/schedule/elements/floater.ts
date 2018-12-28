import {Slim} from '../node_modules/slim-js/Slim.js';
import {tag, template} from '../node_modules/slim-js/Decorators.js';

@tag('floater-top')
@template(`<div id="floater">
            <div class="menu">
                <span class="material-icons menu_text">menu</span>
                <span bind class="header_text" id="header_text">{{headerTXT}}</span>
            </div>
        </div>`)
class FloaterTop extends Slim {
    headerTXT : string;
    onBeforeCreated() {
        this.headerTXT = "Programma's";
    }
}