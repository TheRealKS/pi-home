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

export interface Programme {
    name : string;
    timecreated : number;
    lastedited : number;
    content : ProgrammeContent;
}

export interface ProgrammeContent {
    mon? : ArrayLike<SwitchPoint>
    tue? : ArrayLike<SwitchPoint>
    wed? : ArrayLike<SwitchPoint>
    thu? : ArrayLike<SwitchPoint>
    fri? : ArrayLike<SwitchPoint>
    sat? : ArrayLike<SwitchPoint>
    sun? : ArrayLike<SwitchPoint>
}

export interface SwitchPoint {
    type : SwitchType;
    data : SwitchData;
    range? : number;
    priority? : number;
}

export interface ManualSwitchPoint extends SwitchPoint {
    time : string;
}

export interface AutoSwitchPoint extends SwitchPoint {
    trigger : AutoSwitchTrigger;
}

export interface SwitchData {
    pos : number;
    not_if : SwitchExceptionData;
}

export interface SensorSwitchData extends SwitchData {
    lux_min : number;
    lux_max : number;
    timeout : number;
}

export interface SwitchExceptionData {
    lux_above? : number;
    lux_under? : number;
}