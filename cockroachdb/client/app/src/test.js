const fs = require("fs");
const {ResettablePool} = require('./ResettablePool');
const {RoachKV} = require('./RoachKV');

const {ReadIncWriteTest} = require('perseus-base');

let period = 1000;
if (process.argv.length == 3) {
    period = parseInt(process.argv[2]);
}

const nodes = [ ];

for (const [host, port] of [["roach1", 26257],["roach2", 26257],["roach3", 26257]]) {
    nodes.push(new RoachKV(host, new ResettablePool({
        user: "root",
        database: "lily",
        host: host,
        port: port
    })));
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
