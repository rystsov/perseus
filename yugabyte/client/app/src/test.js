const {RedisKV} = require("./RedisKV");
const {ReadIncWriteTest} = require('perseus-base');

const nodes = [ ];

for (const [host, port] of [["yuga1", 6379],["yuga2", 6379],["yuga3", 6379]]) {
    nodes.push(new RedisKV(host, host, port));
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
