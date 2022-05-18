



export function usage() {

    console.log("usage: sksqlcli [options | server commands]");
    console.log("\toptions:");
    console.log("\t\t--server=address\tConnect to a distant server");
    console.log("\t\t--token=token\tSpecify a token for server auth")
    console.log("\t\t--silent\tOnly output SQL results");
    console.log("\t\t--format=JSON\tReturn table output as JSON");
    console.log("\t\t--remote-only\tOnly process SQL statements on the server.");
    console.log("\t\t\t\tThis mode does not return any data.");
    console.log("\tserver commands:");
    console.log("\t\t--api-key=key\tSpecify the API key to use. If not the environment var SKSQL_API_KEY will be used");
    console.log("\t\t--create-database=name\tCreate a new database and returns the hash id");
    console.log("\t\t--delete-database=hashid\tDelete the database with the specified hash id");
    console.log("\t\t--list-databases\tList all databases");
}