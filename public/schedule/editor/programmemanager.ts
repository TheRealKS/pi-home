import * as Structure from "../datastructure/structure";

export class ProgrammeManager {
    programme : Structure.Programme;

    constructor(programme : Structure.Programme) {
        this.programme = programme;
    }

    getContents(day : string) {
        return this.programme.content[day];
    }

    addDay(day) {
        let o : ArrayLike<Structure.SwitchPoint> = [];
        if (this.programme.content[day]) {
            throw "That day already exists!";
        }
        this.programme.content[day] = o;
    }

    

}