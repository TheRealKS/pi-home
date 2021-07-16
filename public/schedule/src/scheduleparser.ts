import { AutoProgrammeRule, IProgramme, ProgrammeRule, StaticProgrammeRule } from "./sructure";

export async function fetchProgramme(nm : String) : Promise<IProgramme> {
    return fetch("schedules/" + nm + ".json").then(res => {if (res.ok) return res.json()});
}

export async function fetchProgrammes() : Promise<Array<IProgramme>> {
    return fetch("http://localhost:3000/getschedules.php").then(res => {if (res.ok) return res.json()});
}

export async function fetchActiveProgramme() : Promise<any> {
    return fetch("http://localhost:3000/getactiveschedule.php").then(res => {if (res.ok) return res.text()});
}

export interface Tuple {
    originalindex : number,
    rule : ProgrammeRule
}

export function sortProgrammeRules(p : Array<ProgrammeRule>) : Array<Array<Tuple>> {
    let o : Array<Array<Tuple>> = new Array(7);
    p.forEach((rule, i) => {
        let day : number;
        if (isStaticRule(rule)) {
            day = parseInt(rule.interval.split(" ")[4]);
        } else {
            let r = <AutoProgrammeRule>rule;
            day = r.day;
        }
        let t = {originalindex: i, rule: rule};
        if (o[day]) {
            o[day].push(t);
        } else {
            o[day] = [t];
        }
    });
    return o;
}

export function isStaticRule(r: ProgrammeRule): r is StaticProgrammeRule {
    return (r as StaticProgrammeRule).interval !== undefined;
}

export function createEmptyProgramme() : IProgramme {
    let now = new Date().getTime();
    let o : IProgramme = {
        name: "",
        timecreated: now,
        lastedited: now,
        content : []
    };
    return o;
}
