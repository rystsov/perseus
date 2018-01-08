const fs = require("fs");
const {RethinkKV} = require("./RethinkKV");
const {ResettablePool} = require("./ResettablePool");
const {ReadIncWriteTest} = require('perseus-base');

let period = 1000;
if (process.argv.length == 3) {
    period = parseInt(process.argv[2]);
}

const nodes = [];

for (const [host, port] of [["rethink1", 28016],["rethink2", 28016],["rethink3", 28016]]) {
    nodes.push(new RethinkKV(new ResettablePool({
        host: host,
        port: port,
        db: "test"
    }), "lily", host));
}

const test = new ReadIncWriteTest(nodes, period);

(async () => {
    try {
        await test.run();
    } catch(e) {
        console.info("WAT?!");
        console.info(e);
    }
})();
