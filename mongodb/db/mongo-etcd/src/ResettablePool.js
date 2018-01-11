const MongoClient = require('mongodb').MongoClient;

class ResettablePool {
    constructor(url) {
        this.url = url;
        this.client = null;
    }

    connect() {
        return new Promise((respond, reject) => {
            if (this.client != null) {
                respond(this.client);
            } else {
                MongoClient.connect(this.url, (err, client) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.client = client;
                        respond(this.client);
                    }
                });
            }
        });
    }

    reset() {
        if (this.client != null) {
            try { this.client.close(); } catch(e) { }
            this.client = null;
        }
    }
}

exports.ResettablePool = ResettablePool;