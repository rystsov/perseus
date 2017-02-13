const fs = require("fs");

const {ReadIncWriteTest} = require('./ReadIncWriteTest');

const settings = JSON.parse(fs.readFileSync("etc/roach-cluster.json"));

const nodes = Object.keys(settings).map(key => ({
  user: "root",
  database: "lily",
  host: settings[key].host,
  port: settings[key].pgPort
}));

console.info(nodes);

const app = new ReadIncWriteTest(nodes);

(async function() {
    await app.run();
})();
