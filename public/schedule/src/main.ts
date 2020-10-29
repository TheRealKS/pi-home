import { fetchProgramme } from "./scheduleparser"
import {OverviewList} from "./elements/overview-list";
import { DetailsBase } from "./elements/details-base";
import { CircleSelector } from "./elements/circle-selector";

window.onload = () => {
    fetchProgramme("test").then(p => {
       let overview = new OverviewList(p);
       document.getElementById("overview").appendChild(overview); 
    });

    let det = new DetailsBase("Schakelpunt Toevoegen");
    let circles = new CircleSelector(["M", "A", "B"]);
    det.appendChild(circles);
    document.getElementById("details").appendChild(det);
}