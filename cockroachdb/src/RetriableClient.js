const pg = require('pg');

class RethinkKV {
    constructor(pool) {
        this.pool = pool;
    }
    async read(key) {
        try {
            const client = await this.pool.connect();
            const sql = "SELECT * FROM storage WHERE key = $1::text";
            const result = await query(client, sql, [key]);
            return result.length == 0 ? null : result[0].value
        } catch (e) {
            this.pool.retry();
            throw e;
        }
    }
    async create(key, value) {
        try {
            const client = await this.pool.connect();
            const sql = "INSERT INTO storage VALUES ($1::text, $2::text)";
            await query(client, sql, [key, value]);
            return true;
        } catch (e) {
            this.pool.retry();
            throw e;
        }
    }
    async update(key, value) {
        try {
            const client = await this.pool.connect();
            const sql = "UPDATE storage SET value = $2::text WHERE key = $1::text";
            await query(client, sql, [key, value]);
            return true;
        } catch (e) {
            this.pool.retry();
            throw e;
        }
    }
}

class ResettablePool {
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