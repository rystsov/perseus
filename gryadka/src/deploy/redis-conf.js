const fs = require("fs");
const mustache = require("mustache");

const template = "etc/redis.mustache";

const settings = JSON.parse(fs.readFileSync("etc/gryadka-cluster.json"));
const acceptor = process.argv[2];
const path = process.argv[3];

const conf = prepareRedisConf(settings.acceptors[acceptor], path);
writeRedisConf(conf, template, path);

function prepareRedisConf(settings, path) {
    return {
        pidfile: path + "/redis.pid",
        port: settings.storage.port,
        host: settings.storage.host,
        dir: path + "/",
        dbfilename: "dump.rdb",
        appendfilename: "appendonly.aof"
    };
}

function writeRedisConf(conf, template, path) {
    template = fs.readFileSync(template, 'utf8');
    const content = mustache.render(template, conf);
    const file = fs.openSync(path + "/redis.conf", "w");
    fs.writeSync(file, content);
    fs.closeSync(file);
}