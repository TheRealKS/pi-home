var Stage;
(function (Stage) {
    Stage[Stage["DAYS"] = 0] = "DAYS";
    Stage[Stage["CONTENT"] = 1] = "CONTENT";
})(Stage || (Stage = {}));
var icon = {
    dawn: "brightness_6",
    sundown: "brightness_4",
    pos: "import_export",
    light: "brightness_auto"
};
var days = {
    mon: "Maandag",
    tue: "Dinsdag",
    wed: "Woensdag",
    thu: "Donderdag",
    fri: "Vrijdag",
    sat: "Zaterdag",
    sun: "Zondag"
};
var automaticevents = {
    dawn: "Zonsopkomst",
    sundown: "Zonsondergang"
};
var currentprogramme, currentday;
var currentdaycontent;
const AUTOMATIC = "Automatisch";
const REGULAR = "Regulier";
function initEditor(name) {
    document.getElementById("overlay").style.display = "flex";
    let list = document.getElementById("list");
    list.innerHTML = "";
    loadProgramme(name);
}
function loadProgramme(name) {
    programmes.forEach(element => {
        if (element.name === name) {
            //Found a hit
            currentprogramme = element;
            let list = document.createElement("div");
            list.id = "list";
            list.className = "list";
            document.body.appendChild(list);
            fillList(Stage.DAYS);
            document.getElementById("header_text").innerHTML = element.name;
            document.getElementById("overlay").style.display = "none";
        }
    });
}
function fillList(stage) {
    var list = document.getElementById("list");
    if (stage === Stage.DAYS) {
        let dayss = Object.keys(currentprogramme.content);
        dayss.forEach(element => {
            let daynl = days[element];
            let numberofevents = currentprogramme.content[element].length;
            list.appendChild(createListEntryDay(daynl, numberofevents));
        });
        document.getElementById("");
    }
    else if (stage === Stage.CONTENT) {
        document.getElementById("overlay").style.display = "flex";
        list.innerHTML = "";
        currentdaycontent = currentprogramme.content[currentday];
        let l = currentdaycontent.length;
        //Array for all entries that are automatic
        let automatic = [];
        //Array for all entries that do not fit the automatic category
        let postponed = [];
        for (var i = 0; i < l; i++) {
            let type = currentdaycontent[i].type;
            if (type === "auto") {
                let trigger = currentdaycontent[i].trigger;
                let title = automaticevents[trigger];
                let caption = "Positie: " + currentdaycontent[i].data.pos;
                let element = createListEntryContent(icon[trigger], title, caption);
                automatic.push(element);
            }
            else if (type === "pos" || type === "light") {
                let iconval = icon[type];
                let title = currentdaycontent[i].time;
                if (currentdaycontent[i].range) {
                    let endtime = timeMath(title, parseInt(currentdaycontent[i].range));
                    if (type === "pos") {
                        title += " ~ " + endtime;
                    }
                    else {
                        title += " - " + endtime;
                    }
                }
                let caption = "Positie: " + currentdaycontent[i].data.pos;
                if (type === "light") {
                    let luxrange = "Lux: " + currentdaycontent[i].data.lux_min + " - " + currentdaycontent[i].data.lux_max;
                    caption = luxrange + " | " + caption;
                }
                let element = createListEntryContent(iconval, title, caption);
                postponed.push(element);
            }
        }
        if (automatic.length > 0) {
            list.appendChild(createSubHeader(AUTOMATIC));
            let n = automatic.length;
            for (var i = 0; i < n; i++) {
                list.appendChild(automatic[i]);
            }
        }
        if (postponed.length > 0) {
            list.appendChild(createSubHeader(REGULAR));
            let k = postponed.length;
            for (var i = 0; i < k; i++) {
                list.appendChild(postponed[i]);
            }
        }
        if (postponed.length === 0 && automatic.length === 0) {
            document.getElementById("no_events").style.display = "flex";
        }
        document.getElementById("header_text").innerHTML = days[currentday];
    }
    document.getElementById("overlay").style.display = 'none';
    return list;
}
function createListEntryDay(dayy, events) {
    let element = document.createElement("list-item-day");
    element.setAttribute("name", dayy);
    let dayelem = document.createElement("span");
    dayelem.slot = "list_item_title";
    dayelem.innerHTML = dayy;
    let eventelem = document.createElement("span");
    eventelem.slot = "list_item_caption";
    let eventnumbertext = events === 1 ? " instelling" : " instellingen";
    eventelem.innerHTML = events.toString() + eventnumbertext;
    element.appendChild(dayelem);
    element.appendChild(eventelem);
    element.addEventListener("click", (ev) => {
        let target = ev.target;
        //Convert day back to array indices
        let daynl = target.getAttribute("name");
        currentday = Object.keys(days).find(key => days[key] === daynl);
        fillList(Stage.CONTENT);
    });
    return element;
}
function createSubHeader(content) {
    let header = document.createElement("div");
    header.className = "subheader";
    header.innerHTML = content;
    return header;
}
function createListEntryContent(type, title, caption) {
    let entry = document.createElement("list-item-programme");
    let icon = document.createElement("span");
    icon.slot = "icon";
    icon.innerHTML = type;
    let titleelem = document.createElement("span");
    titleelem.slot = "list_item_title";
    titleelem.innerHTML = title;
    let captionelem = document.createElement("span");
    captionelem.slot = "list_item_caption";
    captionelem.innerHTML = caption;
    entry.appendChild(icon);
    entry.appendChild(titleelem);
    entry.appendChild(captionelem);
    return entry;
}
function timeMath(begin, range) {
    let split1 = begin.split(":");
    let hours1 = parseInt(split1[0]);
    let minutes1 = parseInt(split1[1]);
    let newminutes = minutes1 + range;
    if (newminutes > 59) {
        let hours = Math.floor(newminutes / 60);
        hours += hours1;
        let minutes = newminutes % 60;
        let minnutes = minutes.toString();
        if (minnutes === "0") {
            minnutes += "0";
        }
        if (minutes < 10 && minutes > 0) {
            minnutes = "0" + minnutes;
        }
        return hours.toString() + ":" + minnutes;
    }
    else {
        return split1[0] + ":" + newminutes.toString();
    }
}
