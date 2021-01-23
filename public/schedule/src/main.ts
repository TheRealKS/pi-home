import { fetchProgramme } from "./scheduleparser"
import {OverviewList} from "./elements/overview-list";
import { DetailsBase } from "./elements/details-base";
import { AddPoint } from "./elements/add-point";
window.onload = () => {
    fetchProgramme("test").then(p => {
       let overview = new OverviewList(p);
       document.getElementById("overview").appendChild(overview); 
    });

    let circles = new AddPoint();
    let det = new DetailsBase("Schakelpunt Toevoegen", circles);
    document.getElementById("details").appendChild(det);
}