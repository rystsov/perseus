const fs = require("fs");
const {MysqlKV} = require("./MysqlKV");
const {ResettablePool} = require("./ResettablePool");

const {ReadIncWriteTest} = require('perseus-base');

let period = 1000;
if (process.argv.length == 3) {
    period = parseInt(process.argv[2]);
}

const nodes = [ ];

for (const [host, port] of [["tidb1", 4000],["tidb2", 4000],["tidb3", 4000]]) {
    nodes.push(new MysqlKV(host, new ResettablePool({
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
