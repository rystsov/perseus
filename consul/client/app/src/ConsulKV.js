const request = require("request");

function ConflictError() {
  this.name = 'ConflictError';
  this.stack = (new Error()).stack;
}
ConflictError.prototype = Object.create(Error.prototype);
ConflictError.prototype.constructor = ConflictError;

class ConsulKV {
    constructor(id, hostPort) {
        this.url = "http://" + hostPort + "/v1/kv";
        this.id = id;
    }
    async read(key) {
        return read(this.url, key, null);
    }
    async create(key, val) {
        return update(this.url, key, val)
    }
    async update(key, val) {
        return update(this.url, key, val);
    }
}

function read(url, key, onEmpty) {
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'get',
                url: url + "/" + key + "?consistent=true",
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
                    resolve(new Buffer(JSON.parse(body)[0]["Value"], 'base64').toString('ascii'));
                    return;
                }
                reject(new Error("Unexpected return code: " + res.statusCode));
            }
        );
    });
}

function update(url, key, val) {
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'put',
                body: "" + val,
                url: url + "/" + key,
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

exports.ConsulKV = ConsulKV;
exports.ConflictError = ConflictError;