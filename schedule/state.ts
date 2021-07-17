import { ProgrammeRule } from "./structure/i_programme";

export interface State {
    pos : number,
    changedby : ProgrammeRule
}