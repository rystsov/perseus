const fs = require("fs");
const {RemoteTesterClient} = require("./RemoteTesterClient");

const {TestAggregator} = require("./TestAggregator");

let period = 1000;
if (process.argv.length == 3) {
    period = parseInt(process.argv[2]);
}

const nodes = [ ];

for (const [host, port] of [["mongo1", 2379],["mongo2", 2379],["mongo3", 2379]]) {
    nodes.push(new RemoteTesterClient(host, port));
}

const test = new TestAggregator(nodes, period);

(async () => {
    try {
        await test.run();
    } catch(e) {
        console.info("WAT?!");
        console.info(e);
    }
})();