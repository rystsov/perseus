const fs = require("fs");
const {ConsulKV} = require("./ConsulKV");

const {ReadIncWriteTest} = require('perseus-base');

let period = 1000;
if (process.argv.length == 3) {
    period = parseInt(process.argv[2]);
}

const nodes = [ ];

for (const [host, port] of [["consul1", 8500],["consul2", 8500],["consul3", 8500]]) {
    nodes.push(new ConsulKV(host, host + ":" + port));
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
