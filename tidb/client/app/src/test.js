const {MysqlKV} = require("./MysqlKV");
const {ResettablePool} = require("./ResettablePool");
const {ReadIncWriteTest} = require('perseus-base');

const nodes = [];

for (const [host, port] of [["tidb1", 4000],["tidb2", 4000],["tidb3", 4000]]) {
    nodes.push(new MysqlKV(host, new ResettablePool({
        host     : host,
        user     : 'root',
        database : 'lily',
        port     : port
    }, host + ":" + port)));
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
