const fs = require("fs");
const {RethinkKV} = require("./RethinkKV");
const {ResettablePool} = require("./ResettablePool");
const {ReadIncWriteTest} = require('perseus-base');

const cluster = JSON.parse(fs.readFileSync("etc/rethink-cluster.json"));

let period = 1000;
if (process.argv.length == 3) {
    period = parseInt(process.argv[2]);
}

// const nodes = [];

// for (const nodeId of Object.keys(cluster)) {
//     const {host, driverPort} = cluster[nodeId];
//     nodes.push(new RethinkKV(new ResettablePool({host: host, port: driverPort, db: "test"}), "lily"));
// }

console.info(period);
// const test = new ReadIncWriteTest(nodes, period);

// (async () => {
//     try {
//         await test.run();
//     } catch(e) {
//         console.info("WAT?!");
//         console.info(e);
//     }
// })();
