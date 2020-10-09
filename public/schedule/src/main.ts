import { fetchProgramme } from "./scheduleparser"
import {OverviewList} from "./elements/overview-list";

window.onload = () => {
    fetchProgramme("test").then(p => {
       let overview = new OverviewList(p);
       document.getElementById("overview").appendChild(overview); 
    });
}