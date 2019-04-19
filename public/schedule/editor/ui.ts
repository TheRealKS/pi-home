import {ListItem} from '../elements/list-item.js';
import {ListItemDay} from '../elements/list-item-day.js';
import {ListCategoryHeader} from '../elements/list-category-header.js';
import { List, ListElement } from './list.js';

import * as Structure from "../datastructure/structure.js";
import { ListItemSwitch } from '../elements/list-item-switch.js';
import { ProgrammeManager } from './programmemanager.js';
import { fabmanager } from './fab.js';
import { Stage } from './fab.js';

window.onload = function load() {
    fetch('schedules/getschedules.php')
    .then(res => {
        return res.json();
    })
    .then(json => {
        createProgrammeList(json);
    });
}

var programmes : Array<Structure.Programme> = [];
var numofprogrammes = 0;

var currentprogramme : ProgrammeManager;

var list : List;

function createProgrammeList(json : Array<unknown>) {
    numofprogrammes = json.length;
    json.forEach(element => {
        fetch("schedules/" + element)
        .then(res => res.json()
            .then(json => {
                programmes.push(json);
            })
        );
    });
    waitForFetch();
}

function waitForFetch() {
    if (programmes.length == numofprogrammes) {
        createList();
    } else {
        setTimeout(waitForFetch, 10);
    }
}

function createList() {
    list = new List(document.getElementById("list"));
    if (programmes.length === 0) {
        document.getElementById("no_events").style.display = "flex";
    }
    for (var programme of programmes) {
        let name = programme.name;
        let days = getProgrammeActiveDays(programme);
        let item = new ListItem(name, days.join('-'));
        item.setAttribute("nm", name);
        item.addEventListener("click", openProgramme.bind(name));
        let litem = new ListElement<ListItem>(item);
        list.addElement(litem);
    }
    document.getElementById('overlay').style.display = "none";
}

function getProgrammeActiveDays(json : Structure.Programme) : Array<string> {
    let content = json.content;
    let days = Object.keys(content);
    let capsdays = [];
    let k = days.length;
    for (var i = 0; i < k; i++) {
        let base = days[i];
        let caps = days[i].substr(0, 1).toUpperCase();
        let joined = caps + base.substr(1); 
        capsdays.push(joined);
    }
    return capsdays;
}

function findProgramme(name : string) {
    let k = programmes.length;
    for (var i = 0; i < k; i++) {
        if (programmes[i].name === name) {
            return programmes[i];
        }
    }
    return undefined;
}

function openProgramme(ev : Event) {
    if (ev.srcElement.hasAttribute("no_event_prop")) {
        return;
    }
    let name = this;
    let programme = findProgramme(name);
    currentprogramme = new ProgrammeManager(programme);
    let days = Object.keys(programme.content);
    list.clear();
    for (var day of days) {
        let d : ArrayLike<Structure.SwitchPoint> = programme.content[day];
        let entry = new ListItemDay(day, d.length);
        entry.addEventListener("click", openProgrammeDay.bind(day));
        let litem = new ListElement<ListItemDay>(entry);
        list.addElement(null, litem);
    }
    fabmanager.selectStage(Stage.PROGRAMME);
}

function openProgrammeDay() {
    list.clear();
    let day = this;
    let o = sortProgrammeSwitches(day);
    fabmanager.selectStage(Stage.DAY);
    if (o.auto.length > 0) {
        let header = new ListCategoryHeader("Automatisch");
        let eelem = new ListElement<ListItemDay>(header);
        list.addElement(eelem);
        for (var a of o.auto) {
            let elem = new ListItemSwitch(currentprogramme, "brightness_auto", a.trigger.toString(), a.data.pos.toString());
            if (a.trigger == Structure.AutoSwitchTrigger.DAWN) {
                elem.title = "Zonsopkomst";
            } else if (a.trigger == Structure.AutoSwitchTrigger.DUSK) {
                elem.title = "Zonsondergang";
            } else {
                elem.title = "Anders";
            }
            let litem = new ListElement<ListItemDay>(elem);
            list.addElement(litem);
        }
    }

    if (o.man.length > 0) {
        let header = new ListCategoryHeader("Handmatig");
        let eelem = new ListElement<ListItemDay>(header);
        list.addElement(eelem);
        for (var b of o.man) {
            let elem = new ListItemSwitch(currentprogramme, "import_export", b.time, b.data.pos.toString());
            let litem = new ListElement<ListItemDay>(elem);
            list.addElement(litem);
        }
    }

    if (o.sensor.length > 0) {
        let header = new ListCategoryHeader("Sensor");
        let eelem = new ListElement<ListItemDay>(header);
        list.addElement(eelem);
        for (var b of o.man) {
            let elem = new ListItemSwitch(currentprogramme, "import_export", b.time, b.data.pos.toString());
            let litem = new ListElement<ListItemDay>(elem);
            list.addElement(litem);
        }
    }
}

function sortProgrammeSwitches(day : string) : {auto : Array<Structure.AutoSwitchPoint>, man : Array<Structure.ManualSwitchPoint>, sensor : Array<Structure.ManualSwitchPoint>} {
    let switches : ArrayLike<Structure.SwitchPoint> = currentprogramme.getContents(day);
    let result = {auto : [], man : [], sensor : []};
    for (var i = 0; i < switches.length; i++) {
        var switchpoint = switches[i];
        switch (switchpoint.type) {
            case Structure.SwitchType.AUTO:
                result.auto.push(switchpoint);
                break;
            case Structure.SwitchType.POSITION:
                result.man.push(switchpoint);
                break;
            case Structure.SwitchType.SENSOR:
                result.sensor.push(switchpoint);
                break;
            default:
                throw "Unknown switch type encountered!";      
        }
    }   
    return result;
}