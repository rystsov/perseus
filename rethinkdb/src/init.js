const fs = require("fs");
const r = require("rethinkdb");

const cluster = JSON.parse(fs.readFileSync("etc/rethink-cluster.json"));
const settings = cluster[process.argv[2]];

r.connect({host: settings.host, port: settings.driverPort}, function(err, conn) {
    if (err) {
        console.info(err);
    } else {
        r.db("test").tableCreate("lily", {
            durability: "hard",
            replicas: 3
        }).run(conn, function(err, result) {
            if (err) {
                console.info(err);
            } else {
                console.info("OK");
            }
        });
    }
});