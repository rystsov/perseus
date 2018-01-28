const {RiakKV} = require("./RiakKV");
const {ReadIncWriteTest} = require('perseus-base');

const nodes = [ ];

for (const [host, port] of [["riak1", 8098],["riak2", 8098],["riak3", 8098]]) {
    nodes.push(new RiakKV(host, host + ":" + port));
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
