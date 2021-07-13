import { isStaticRule, Tuple } from "./scheduleparser";
import { AutoProgrammeRule, ProgrammeRule, StaticProgrammeRule } from "./sructure";

export function computeRuleSignature(r : ProgrammeRule) {
    let signature = "";
    signature += r.action.pos.toString();
    if (isStaticRule(r)) {
        let srule : StaticProgrammeRule = <StaticProgrammeRule>r;
        signature += srule.interval;
        signature += srule.randomize;
    } else {
        let arule : AutoProgrammeRule = <AutoProgrammeRule>r;
        signature += arule.trigger.toString();
    }

    var hash = 0;
    for (var i = 0; i < signature.length; i++) {
        var character = signature.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash;
    }
    return hash;
}

export function programmeEmpty(p : Array<Array<Tuple>>) {
    for (var arr of p) {
        if (arr?.length > 0 ?? arr) {
            return false;
        }
    }
    return true;
}