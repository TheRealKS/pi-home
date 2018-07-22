var programmes = [];

var Color = [
    "0xffe57373",
    "0xfff06292",
    "0xffba68c8",
    "0xff9575cd",
    "0xff7986cb",
    "0xff64b5f6",
    "0xff4fc3f7",
    "0xff4dd0e1",
    "0xff4db6ac",
    "0xff81c784",
    "0xffaed581",
    "0xffff8a65",
    "0xffd4e157",
    "0xffffd54f",
    "0xffffb74d",
    "0xffa1887f",
    "0xff90a4ae"
]

function getRandomColor() {
    let rand = Math.floor(Math.random()*16);
    return toColor(Color[rand]);
}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}

window.onload = function() {
    downloadTemplatesList();

    var list = document.getElementsByClassName("list")[0];
    new Slip(list);

    list.addEventListener("slip:animateswipe", function(ev) {
        let details = ev.detail;
        if (details.x > -150 && details.x < 0) {
            document.getElementById("prog_1").style.zIndex = "0";
        } else {
            ev.preventDefault();
            document.getElementById("prog_1").children[0].style.backgroundSize = "100% 100%";
        }
    });

    list.addEventListener("slip:beforeswipe", function(ev) {
        if (ev.target.className === "select_programme") {
            ev.preventDefault();    
        }
    });

    list.addEventListener("slip:cancelswipe", function(ev) {
        document.getElementById("prog_1").children[0].style.backgroundSize = "0% 0%";
        ev.preventDefault();
    });

    list.addEventListener("slip:swipe", function(ev) {
        document.getElementById("prog_1").children[0].style.backgroundSize = "0% 0%";
    });

    list.addEventListener("slip:beforereorder", function(ev) {
        ev.preventDefault();
    })
}   

function loadProgrammes() {
    fetch("schedules/getschedules.php")
    .then(res => res.json()
        .then(json => {
            createProgrammeList(json);
        })
    );
}   

function createProgrammeList(json) {
    json.forEach(element => {
        fetch("schedules/" + element)
        .then(res => res.json()
            .then(json => {
                programmes.push(json);
                createListEntry(json);
            })
        );
    });
}

function createListEntry(json) {
    let name = json.name;
    let days = getProgrammeActiveDays(json);
    let entry = createListItem(name, days.join("-"));
    document.getElementById("list").appendChild(entry);
    let pseudo = document.createElement("list-item-swipe");
    document.getElementById("list").appendChild(pseudo);
}

function getProgrammeActiveDays(json) : Array<string> {
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

function createListItem(title_txt : string, caption_txt : string) {
    let item = document.createElement("list-item");
    let title = document.createElement("span");
    title.slot = "list_item_title";
    title.innerHTML = title_txt;
    let caption = document.createElement("span");
    caption.slot = "list_item_caption";
    caption.innerHTML = caption_txt;
    item.appendChild(title);
    item.appendChild(caption);
    return item;
}