const fs = require("fs");
const {MysqlKV} = require("./MysqlKV");
const {ResettablePool} = require("./ResettablePool");

const {ReadIncWriteTest} = require('perseus-base');

const cluster = JSON.parse(fs.readFileSync("etc/tidb-cluster.json"));

let period = 1000;
if (process.argv.length == 3) {
    period = parseInt(process.argv[2]);
}

const nodes = [];

for (const nodeId of Object.keys(cluster)) {
    const {host, db: {port}} = cluster[nodeId];
    nodes.push(new MysqlKV(new ResettablePool({
        host     : host,
        user     : 'root',
        database : 'lily',
        port     : port
    }, host + ":" + port)));
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
