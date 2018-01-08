const fs = require("fs");
const r = require("rethinkdb");

r.connect({host: "rethink1", port: 28016}, function(err, conn) {
    if (err) {
        console.info(err);
        process.exit(1);
    } else {
        r.db("test").tableCreate("lily", {
            durability: "hard",
            replicas: 3
        }).run(conn, function(err, result) {
            if (err) {
                if (err.msg.includes("already exists")) {
                    console.info("test.lily created");
                    process.exit(0);
                } else {
                    console.info(err);
                    process.exit(1);
                }
            } else {
                console.info("test.lily created");
                process.exit(0);
            }
        });
    }
});