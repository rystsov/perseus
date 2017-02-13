const request = require("request");

function ConflictError() {
  this.name = 'ConflictError';
  this.stack = (new Error()).stack;
}
ConflictError.prototype = Object.create(Error.prototype);
ConflictError.prototype.constructor = ConflictError;

class EtcdKV {
    constructor(hostPort) {
        this.url = "http://" + hostPort + "/v2/keys";
        this.hostPort = hostPort;
    }
    async read(key) {
        return read(this.url, key, null);
    }
    async create(key, val) {
        return create(this.url, key, val)
    }
    async write(key, ver, val) {
        return write(this.url, key, ver, val);
    }
}

function read(url, key, onEmpty) {
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'get',
                url: url + "/" + key + "?quorum=true",
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
                    body = JSON.parse(body);
                    resolve({ ver: body.node.modifiedIndex, val: body.node.value});
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
                form:  {
                    value: val
                },
                url: url + "/" + key + "?prevExist=false",
                timeout: 1000
            }, 
            (err, res, body) => {
                if (err != null) {
                    reject(new Error());
                    return;
                }
                if (res.statusCode == 201) {
                    resolve(true);
                    return;
                }
                if (res.statusCode == 412) {
                    reject(new ConflictError())
                    return;
                }
                reject(new Error("Unexpected return code: " + res.statusCode));
            }
        );
    });
}

function write(url, key, ver, val) {
    return new Promise((resolve, reject) => {
        request(
            {
                method: 'put',
                form:  {
                    value: val
                },
                url: url + "/" + key + "?prevIndex=" + ver,
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
                if (res.statusCode == 412) {
                    reject(new ConflictError())
                    return;
                }
                reject(new Error("Unexpected return code: " + res.statusCode));
            }
        );
    });
}

exports.EtcdKV = EtcdKV;
exports.ConflictError = ConflictError;