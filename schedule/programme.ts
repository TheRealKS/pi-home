import { readFile, exists } from 'fs';
import {promisify } from 'util';
import * as Structure from './structure/i_programme';

export class Programme implements Structure.IProgramme {
    name: string;
    timecreated: number;
    lastedited: number;
    content: Structure.ProgrammeRule[];

    static async fromJSON(file : string) : Promise<Programme> {   
        try {
            let ex = await promisify(exists)(file);
            if (ex) {
                //File exists
                let filedata = await promisify(readFile)(file);
                let json : Structure.IProgramme = JSON.parse(filedata.toString());
                return Promise.resolve(json);
            }
        } catch (err) {
            console.error(err);
        }
    }
}