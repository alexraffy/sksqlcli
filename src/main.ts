import fetch from "node-fetch";
import {WebSocket} from 'ws';
// @ts-ignore
global["fetch"] = fetch;

//@ts-ignore
global["WebSocket"] = WebSocket;

import {SKSQL, TAuthSession, TDBEventsDelegate} from "sksql";
import {promptReady} from "./prompt";
import {getState} from "./state";
import {usage} from "./usage";
import {createDatabase, deleteDatabase, listDatabases} from "sksqlapi";
import {escape} from "querystring";


export function main() {
    let encryptionKey = "";
    let token = "";
    let apiKey = process.env.SKSQL_API_KEY;
    let action : "BATCH" | "CREATEDB" | "DELETEDB" | "LISTDB" = "BATCH";
    let dbToCreate = "";
    let hashId = "";



    // check args
    for (let i = 0; i < process.argv.length; i++) {
        let arg = process.argv[i];
        if (arg.startsWith("--help")) {
            usage();
            process.exit(0);
        } else if (arg.startsWith("--server=")) {
            hashId = arg.split("=")[1];
        } else if (arg.startsWith("--token=")) {
            token = arg.split("=")[1];
        } else if (arg.startsWith("--api-key=")) {
            apiKey = arg.split("=")[1];
        } else if (arg.startsWith("--create-database=")) {
            action = "CREATEDB";
            dbToCreate = arg.split("=")[1];
        } else if (arg.startsWith("--delete-database=")) {
            action = "DELETEDB";
            hashId = arg.split("=")[1];
        } else if (arg.startsWith("--list-databases")) {
            action = "LISTDB";
        } else if (arg.startsWith("--silent")) {
            getState().silent = true;
        } else if (arg.startsWith("--format=JSON")) {
            getState().output = "JSON";
        } else if (arg.startsWith("--remote-only")) {
            getState().db.remoteModeOnly = true;
        } else if (arg.startsWith("--")){
            usage();
            process.exit(0)
        }

    }

    let db = new SKSQL();
    getState().db = db;

    if (action === "BATCH") {
        if (hashId === "") {
            promptReady();
        } else {
            let delegate: TDBEventsDelegate = {
                authRequired(db: SKSQL, databaseHashId: string): TAuthSession {
                    return {valid: true, token: token, name: ""};
                },
                connectionError(db: SKSQL, databaseHashId: string, error: string): any {
                    if (getState().output === "TEXT") {
                        console.log("Connection Error: " + error);
                    } else {
                        console.log("{error: \"Connection Error: " + escape(error) + "\"}");
                    }
                    process.exit(0);
                },
                connectionLost(db: SKSQL, databaseHashId: string) {
                    process.exit(0);
                },
                ready(db: SKSQL, databaseHashId: string): any {
                    promptReady();
                },
                on(db: SKSQL, databaseHashId: string, message: string, payload: any) {

                }
            }
            db.connectToDatabase(hashId, delegate);
        }
    } else if (action === "CREATEDB") {
        createDatabase(apiKey, encryptionKey, dbToCreate ).then( (v) => {
            if (getState().output === "TEXT") {
                console.log(v);
            } else {
                console.log("{ dbHashId: \"" + v + "\" }");
            }
            process.exit(0);
        }).catch((e) => {
            if (getState().output === "TEXT") {
                console.log(e.message);
            } else {
                console.log("{error: \"" + e.message + "\"}");
            }
            process.exit(0);
        })
    } else if (action === "DELETEDB") {
        deleteDatabase(apiKey, hashId).then((v) => {
            if (getState().output === "TEXT") {
                console.log(v);
            } else {
                console.log("{ deleted: " + (v ? "true" : "false") + "}");
            }
            process.exit(0);
        }).catch((e) => {
            if (getState().output === "TEXT") {
                console.log(e.message);
            } else {
                console.log("{error: \"" + e.message + "\"}");
            }
            process.exit(0);
        })
    } else if (action === "LISTDB") {
        listDatabases(apiKey).then((v) => {
            if (getState().output === "TEXT") {
                if (v.valid === true) {
                    console.table(v.databases);
                }
            } else {
                console.log(JSON.stringify(v));
            }
            process.exit(0);
        }).catch((e) => {

            if (getState().output === "TEXT") {
                console.log(e.message);
            } else {
                console.log("{error: \"" + e.message + "\"}");
            }
            process.exit(0);
        });
    }

}



main();