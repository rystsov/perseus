const {ReadIncWriteTest} = require("./ReadIncWriteTest");
const {EtcdKV} = require("./EtcdKV");

const hostPorts = process.argv[2].split(",");
const conns = hostPorts.map(hostPort => new EtcdKV(hostPort));
const tester = new ReadIncWriteTest(conns);

(async () => {
    await tester.run();
})()
