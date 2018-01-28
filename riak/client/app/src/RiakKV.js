const request = require("request");

class RiakKV {
    constructor(id, hostPort) {
        this.url = "http://" + hostPort + "/types/linearizable3/buckets/kv/keys";
        this.id = id;
    }
    async read(key) {
        return read(this.url, key, null);
    }
    async create(key, val) {
        return create(this.url, key, val)
    }
    async update(key, record) {
        return update(this.url, key, record);
    }
}

function read(url, key, onEmpty) {
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'get',
                url: url + "/" + key,
                timeout: 1000
            }, 
            (err, res, body) => {
                if (err != null) {
                    reject(new Error());
                    return;
                }
                if (res.statusCode == 404) {
                    resolve(onEmpty);
                    return;
                }
                if (res.statusCode == 200) {
                    resolve({
                        version: res.headers["x-riak-vclock"],
                        value: body
                    });
                    return;
                }
                reject(new Error("Unexpected return code: " + res.statusCode));
            }
        );
    });
}

function create(url, key, val) {
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'put',
                body: "" + val,
                url: url + "/" + key + "?returnbody=true",
                headers: { "Content-Type": "text/plain" },
                timeout: 1000
            }, 
            (err, res, body) => {
                if (err != null) {
                    reject(new Error());
                    return;
                }
                if (res.statusCode == 200) {
                    resolve(true);
                    return;
                }
                reject(new Error("Unexpected return code: " + res.statusCode));
            }
        );
    });
}

function update(url, key, record) {
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'put',
                body: "" + record.value,
                url: url + "/" + key + "?returnbody=true",
                headers: {
                    "X-Riak-Vclock": record.version,
                    "Content-Type": "text/plain"
                },
                timeout: 1000
            }, 
            (err, res, body) => {
                if (err != null) {
                    reject(new Error());
                    return;
                }
                if (res.statusCode == 200) {
                    resolve(true);
                    return;
                }
                reject(new Error("Unexpected return code: " + res.statusCode));
            }
        );
    });
}

exports.RiakKV = RiakKV;