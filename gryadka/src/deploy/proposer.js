const fs = require("fs");
const mustache = require("mustache");

const cluster = JSON.parse(fs.readFileSync(process.argv[2]));
cluster.acceptors = asMap(cluster.acceptors);
cluster.proposers = asMap(cluster.proposers);

proposer(cluster, process.argv[3], process.argv[4]);

function proposer(cluster, key, path) {
    const p = cluster.proposers.get(key);
    const settings = {
        id: p.id,
        port: p.port,
        quorum: p.quorum,
        acceptors: p.acceptors.map(aid => {
            return cluster.acceptors.get(aid);
        })
    };
    const file = fs.openSync(`${path}/${key}.json`, "w");
    fs.writeSync(file, JSON.stringify(settings, null, "  "));
    fs.closeSync(file);
}

function asMap(obj) {
    let map = new Map();
    Object.keys(obj).forEach(key => {
        map.set(key, obj[key]);
    });
    return map;
}