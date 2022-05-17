import {SKSQL} from "sksql";


export interface TSKSQLCLI {
    db: SKSQL;
    silent: boolean;
    output: "TEXT" | "JSON";
    listOfCommands: string[];
}


var state : TSKSQLCLI = { db: undefined, silent: false, output: "TEXT", listOfCommands: []};


export function getState() {
    return state;
}