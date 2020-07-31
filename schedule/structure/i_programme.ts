export enum SwitchType {
    AUTO = "auto",
    POSITION = "pos",
    SENSOR = "light"
}

export enum AutoSwitchTrigger {
    DAWN = "dawn",
    DUSK = "sundown",
    OTHER = "other"
}

export interface IProgramme {
    name: string;
    timecreated: number;
    lastedited: number;
    content : Array<ProgrammeRule>
}

export interface ProgrammeRule {
    action : SwitchData;
    condition : SwitchCondition;
    priority? : number;
}

export interface StaticProgrammeRule extends ProgrammeRule {
    interval : string;
    randomize : boolean;
    randomoffsetafter? : number;
    randomoffsetbefore? : number;
}

export interface AutoProgrammeRule extends ProgrammeRule {
    trigger : AutoSwitchTrigger;
}

export interface SwitchData {
    pos : number;
    //posrange
    //interval range
}

export interface SwitchCondition {
    lux_above? : number;
    lux_under? : number;
}