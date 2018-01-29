const request = require("request");

class EtcdKV {
    constructor(id, hostPort) {
        this.url = "http://" + hostPort + "/v2/keys";
        this.id = id;
    }
    async read(key) {
        return read(this.url, key, null);
    }
    async create(key, val) {
        return create(this.url, key, val)
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
                    resolve(body.node.value);
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
                    reject(new Error("Conflict"));
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
                form:  {
                    value: val
                },
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
                if (res.statusCode == 412) {
                    reject(new Error("Conflict"));
                    return;
                }
                reject(new Error("Unexpected return code: " + res.statusCode));
            }
        );
    });
}

exports.EtcdKV = EtcdKV;