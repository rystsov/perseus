const pg = require('pg');

class RetriableClient {
    constructor(config) {
        this.config = config;
        this.client = null;
    }

    connect() {
        return new Promise((respond, reject) => {
            if (this.client != null) {
                respond(this.client);
            } else {
                this.client = new pg.Client(this.config);
                this.client.on('error', err => {
                    this.client = null;
                });
                this.client.connect(err => {
                    if (err) {
                        reject(err);
                    } else {
                        respond(this.client);
                    }
                })
            }
        });
    }

    reset() {
        if (this.client != null) {
            this.client.end(()=>{});
            this.client = null;
        }
    }
}

function query(client, sql, params) {
    return new Promise((respond, reject) => {
        client.query(sql, params, (err, result) => {
            if(err) {
                reject(err);
            } else {
                respond(result.rows);
            }
        });
    });
}

exports.RetriableClient = RetriableClient;
exports.query = query;