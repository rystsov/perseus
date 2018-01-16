const fs = require("fs");
const {RemoteTesterClient} = require("./RemoteTesterClient");

const {TestAggregator} = require("./TestAggregator");

let period = 1000;
if (process.argv.length == 3) {
    period = parseInt(process.argv[2]);
}

const nodes = [ ];

for (const [host, port] of [["gryadka1", 2379],["gryadka2", 2379],["gryadka3", 2379]]) {
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
