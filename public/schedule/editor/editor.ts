export function submitForm() {
    if (currentstage === Stage.PROGRAMMES) {
        uploadProgrammeData(false);
    }
}

interface HTMLInput extends HTMLElement {
    value : string;
}

function uploadProgrammeData(overwrite) {
    var data = <HTMLInput>document.getElementById("programme_name");
    var name = data.value.replace(" ", "_");
    name = encodeURIComponent(name);
    var url = "schedules/uploadschedule.php/" + name + ".json";
    if (overwrite) url += "?overwrite=true";
    fetch(url, {method: "PUT", body: JSON.stringify(data.value)})
    .then((res) => {
        if (res.ok) {   
            return res.text();
        }
    })
    .then(res => {
        if (res === "3") {
            var r = confirm("A program with that name already exists! Do you want to overwrite it?");
            if (r)
                uploadProgrammeData(true);
        } else if (res === "1") {
            console.log("success!");
        } else {
            console.log("NAAY");
        }
    });
}  