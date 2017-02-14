const {ReadIncWriteTest} = require("./ReadIncWriteTest");
const {EtcdKV} = require("./EtcdKV");

let period = 1000;
if (process.argv.length == 4) {
    period = parseInt(process.argv[3]);
}

const hostPorts = process.argv[2].split(",");
const conns = hostPorts.map(hostPort => new EtcdKV(hostPort));
const tester = new ReadIncWriteTest(conns, period);

(async () => {
    await tester.run();
})()
