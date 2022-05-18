# sksqlcli


>usage: sksqlcli [options | server commands]\
options:\
--server=address        Connect to a distant server\
--token=token   Specify a token for server auth\
--silent        Only output SQL results\
--format=JSON   Return table output as JSON\
server commands:\
--api-key=key   Specify the API key to use. If not the environment var SKSQL_API_KEY will be used\
--create-database=name  Create a new database and returns the hash id\
--delete-database=hashid        Delete the database with the specified hash id\
--list-databases        List all databases
