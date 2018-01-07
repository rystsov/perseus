const fs = require("fs");
const {EtcdKV} = require("./EtcdKV");

const {ReadIncWriteTest} = require('perseus-base');

let period = 1000;
if (process.argv.length == 3) {
    period = parseInt(process.argv[2]);
}

const nodes = [ ];

for (const [host, port] of [["gryadka1", 2379],["gryadka2", 2379],["gryadka3", 2379]]) {
    nodes.push(new EtcdKV(host, host + ":" + port));
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
