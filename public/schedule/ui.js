import { ListItem } from './elements/list-item.js';
window.onload = function load() {
    fetch('schedules/getschedules.php')
        .then(res => {
        return res.json();
    })
        .then(json => {
        createProgrammeList(json);
    });
};
var programmes = [];
var numofprogrammes = 0;
function createProgrammeList(json) {
    numofprogrammes = json.length;
    json.forEach(element => {
        fetch("schedules/" + element)
            .then(res => res.json()
            .then(json => {
            programmes.push(json);
        }));
    });
    waitForFetch();
}
function waitForFetch() {
    if (programmes.length == numofprogrammes) {
        createList();
    }
    else {
        setTimeout(waitForFetch, 10);
    }
}
function createList() {
    var list = document.getElementById("list");
    for (var programme of programmes) {
        let name = programme.name;
        let days = getProgrammeActiveDays(programme);
        let item = new ListItem(name, days.join('-'));
        list.appendChild(item);
    }
    document.getElementById('overlay').style.display = "none";
}
function getProgrammeActiveDays(json) {
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
