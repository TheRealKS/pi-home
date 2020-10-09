import { AutoProgrammeRule, IProgramme, ProgrammeRule, StaticProgrammeRule } from "./sructure";

export async function fetchProgramme(nm : String) : Promise<IProgramme> {
    return fetch("schedules/" + nm + ".json").then(res => {if (res.ok) return res.json()});
}

export function sortProgrammeRules(p : Array<ProgrammeRule>) : Array<Array<ProgrammeRule>> {
    let o : Array<Array<ProgrammeRule>> = new Array(7);
    for (let rule of p) {
        let day : number;
        if (isStaticRule(rule)) {
            day = parseInt(rule.interval.split(" ")[4]);
        } else {
            let r = <AutoProgrammeRule>rule;
            day = r.day;
        }
        if (o[day]) {
            o[day].push(rule);
        } else {
            o[day] = [rule];
        }
    }
    return o;
}

export function isStaticRule(r: ProgrammeRule): r is StaticProgrammeRule {
    return (r as StaticProgrammeRule).interval !== undefined;
}
