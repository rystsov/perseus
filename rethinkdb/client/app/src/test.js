const {RethinkKV} = require("./RethinkKV");
const {ResettablePool} = require("./ResettablePool");
const {ReadIncWriteTest} = require('perseus-base');

const nodes = [];

for (const [host, port] of [["rethink1", 28016],["rethink2", 28016],["rethink3", 28016]]) {
    nodes.push(new RethinkKV(new ResettablePool({
        host: host,
        port: port,
        db: "test"
    }), "lily", host));
}

const test = new ReadIncWriteTest(nodes, 1000);

(async () => {
    try {
        await test.run();
    } catch(e) {
        console.info("WAT?!");
        console.info(e);
    }
})();
