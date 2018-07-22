var numofelements, completed = 0, cont = false;
async function setupElements() {
    try {
        await downloadTemplatesList();
        return true;
    }
    catch (e) {
        throw e;
    }
}
function downloadTemplates(json) {
    numofelements = json.length;
    return json.forEach(element => {
        return fetch("../elements/" + element).then(res => {
            if (res.ok) {
                res.text().then((text) => {
                    registerElement(text);
                });
            }
        });
    });
}
function downloadTemplatesList() {
    return fetch("../elements/elementlist.php").then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
        .then(json => {
        downloadTemplates(json);
    });
}
function registerElement(template) {
    template = template.replace(/\n|\r/g, "");
    const matches = template.match(/"(.*?)"/);
    let name = matches ? matches[1] : "";
    var html = template;
    customElements.define(name, class extends HTMLElement {
        constructor() {
            super();
            let doc = document.implementation.createHTMLDocument(name);
            doc.body.innerHTML = html;
            let template = doc.getElementById(name);
            let templateContent = template.content;
            const shadowRoot = this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(templateContent.cloneNode(true));
        }
    });
    if (completed < numofelements) {
        completed++;
    }
    else {
        cont = true;
    }
}
