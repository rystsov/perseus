const {query} = require('./RetriableClient');

class RoachKV {
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

exports.RoachKV = RoachKV;