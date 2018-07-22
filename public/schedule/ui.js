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
];

function getRandomColor() {
    var rand = Math.floor(Math.random() * 16);
    return toColor(Color[rand]);
}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ((num & 0xFF000000) >>> 24) / 255;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}
window.onload = function () {

    //return;
    setupElements().then(function (result) {
            if (result) {
                loadProgrammes().then(function (result) {
                        if (result) {
                            setupSwipe();
                            document.getElementById("overlay").style.display = "none";
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
};
async function loadProgrammes() {
    try {
        await fetch("schedules/getschedules.php")
            .then(function (res) {
                return res.json()
                    .then(async function (json) {
                        await Promise.all(createProgrammeList(json))
                            .then(function (res) {})
                    });
            });
        return true;
    } catch (e) {
        throw e;
    }
}

function createProgrammeList(json) {
    var promises = [];
    for (var i = 0; i < json.length; i++) {
        var element = json[i];
        promises.push(fetch("schedules/" + element)
            .then(function (res) {
                return res.json()
                    .then(function (json) {
                        programmes.push(json);
                        createListEntry(json);
                    });
            }));
    }
    return promises;
}

function createListEntry(json) {
    var name = json.name;
    var days = getProgrammeActiveDays(json);
    var entry = createListItem(name, days.join("-"));
    entry.setAttribute("nm", json.name);
    entry.shadowRoot.getElementById("action_edit").addEventListener("click", (ev) => {
        let prognm = ev.target.parentNode.parentNode.ownerDocument.activeElement.getAttribute("nm");
        initEditor(prognm);
    });
    document.getElementById("list").appendChild(entry);
    var pseudo = createPseudo(json.name);
    document.getElementById("list").appendChild(pseudo);
}

function getProgrammeActiveDays(json) {
    var content = json.content;
    var days = Object.keys(content);
    var capsdays = [];
    var k = days.length;
    for (var i = 0; i < k; i++) {
        var base = days[i];
        var caps = days[i].substr(0, 1).toUpperCase();
        var joined = caps + base.substr(1);
        capsdays.push(joined);
    }
    return capsdays;
}

function createListItem(title_txt, caption_txt) {
    var item = document.createElement("list-item");
    item.className = "opaque_white";
    var title = document.createElement("span");
    title.slot = "list_item_title";
    title.innerHTML = title_txt;
    var caption = document.createElement("span");
    caption.slot = "list_item_caption";
    caption.innerHTML = caption_txt;
    item.appendChild(title);
    item.appendChild(caption);
    return item;
}

function createPseudo(name) {
    let holder = document.createElement("div");
    holder.id = "pseudo_" + name;
    holder.className = "select_programme";
    let sub = document.createElement("div");
    sub.className = "select_icon";
    let txt = document.createElement("span");
    txt.className = "material-icons";
    txt.innerHTML = "done";
    sub.appendChild(txt);
    holder.appendChild(sub);
    return holder;
}

function setupSwipe() {
    var list = document.getElementById("list");
    new Slip(list);
    list.addEventListener("slip:animateswipe", function (ev) {
        var details = ev.detail;
        let nm = ev.target.getAttribute("nm");
        let pseudo = document.getElementById("pseudo_" + nm);
        if (details.x > -150 && details.x < 0) {
            pseudo.style.zIndex = "0";
        } else {
            ev.preventDefault();
            pseudo.children[0].style.backgroundSize = "100% 100%";
        }
    });
    list.addEventListener("slip:beforeswipe", function (ev) {
        if (ev.target.className === "select_programme") {
            ev.preventDefault();
        }
    });
    list.addEventListener("slip:cancelswipe", function (ev) {
        let nm = ev.target.getAttribute("nm");
        let pseudo = document.getElementById("pseudo_" + nm);
        pseudo.children[0].style.backgroundSize = "0% 0%";
        pseudo.style.zIndex = "-1";
        ev.preventDefault();
    });
    list.addEventListener("slip:swipe", function (ev) {
        let nm = ev.target.getAttribute("nm");
        let pseudo = document.getElementById("pseudo_" + nm);
        pseudo.children[0].style.backgroundSize = "0% 0%";
        pseudo.style.zIndex = "-1";
    });
    list.addEventListener("slip:beforereorder", function (ev) {
        ev.preventDefault();
    });
}