import { AutoProgrammeRule, IProgramme, ProgrammeRule, StaticProgrammeRule } from "./sructure";

export async function fetchProgramme(nm : String) : Promise<IProgramme> {
    return fetch("schedules/" + nm + ".json").then(res => {if (res.ok) return res.json()});
}

interface Tuple {
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
