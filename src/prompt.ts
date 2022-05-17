
import * as readline from "readline";
import {readTableAsJSON, SQLResult, SQLStatement} from "sksql";
import {getState} from "./state";

export function promptReady() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.setPrompt(getState().silent ? "" : ">");
    rl.prompt();
    rl.on("line", function (input) {
        let db = getState().db;
        let sql: SQLStatement;
        let ret: SQLResult;

        try {
            sql = new SQLStatement(db, input);
            ret = sql.run() as SQLResult;
            if (ret.error !== undefined) {
                if (getState().output === "TEXT") {
                    console.log(ret.error);
                } else {
                    console.log("{error: \"" + escape(ret.error) + "\"}");
                }
            } else if (ret.resultTableName !== "") {
                let data = readTableAsJSON(db, ret.resultTableName);
                if (getState().output === "TEXT") {
                    console.table(data);
                } else {
                    let result = JSON.stringify(data);
                    console.log(result);
                }
            }
        } catch (e) {
            if (getState().silent === false) {
                if (getState().output === "TEXT") {
                    console.log(e.message);
                } else {
                    console.log("{error: \"" + escape(e.message) + "\"}");
                }
            }
        }
        if (sql !== undefined) {
            sql.close();
        }

        if (getState().silent === false && ret !== undefined) {
            console.log(ret.totalRuntime.toFixed(2) + " ms");
        }
        rl.prompt(false);
    });

    rl.on('close', function () {
        process.exit(0);
    });
    rl.on('SIGINT', () => {
        process.exit(0);
    });
}