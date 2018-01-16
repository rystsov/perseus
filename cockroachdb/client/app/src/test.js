const {ResettablePool} = require('./ResettablePool');
const {RoachKV} = require('./RoachKV');
const {ReadIncWriteTest} = require('perseus-base');

const nodes = [ ];

for (const [host, port] of [["roach1", 26257],["roach2", 26257],["roach3", 26257]]) {
    nodes.push(new RoachKV(host, new ResettablePool({
        user: "root",
        database: "lily",
        host: host,
        port: port
    })));
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
