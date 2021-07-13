import { DaySelector } from "./elements/day-selector";

export function parseInputsToCron(selector : DaySelector, time : String) : Array<string> {
    let days : Array<number> = selector.getSelected().map(day => {
        let dday = parseInt(<string>day);
        if (dday == 6) {
            return 0;
        }
        return dday + 1;
    });
    let minute = time.split(":")[1];
    let hour = time.split(":")[0]

    let rules = [];
    for (let d of days) {
        rules.push(createCronRule(minute, hour, d));
    }
    return rules;
}

export function parseCronToInputs(rule : String) {
    let splits = rule.split(" ");
    let time = splits[1] + ":" + splits[0];
    let day = parseInt(splits[4]);
    if (day == 0) {
        day = 6;
    } else {
        day--;
    }
    let days = [day];
    return {t: time, d: days};
}

function createCronRule(minutes : string, hours : string, day : number) {
    return minutes + " " + hours + " * * " + day;
}