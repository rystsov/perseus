const mysql = require('mysql');

function query(conn, sql, params) {
    return new Promise((respond, reject) => {
        conn.query(sql, params, (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                respond(results)
            }
        });
    });
}

class MysqlKV {
    constructor(pool) {
        this.pool = pool;
        this.hostPort = pool.hostPort;
    }
    async read(key) {
        try {
            const conn = await this.pool.connect();
            const result = await query(conn, "SELECT id, value FROM storage WHERE id = ?", [key]);
            return result.length == 0 ? null : result[0].value;
        } catch (e) {
            this.pool.reset();
            throw e;
        }
    }
    async create(key, value) {
        try {
            const conn = await this.pool.connect();
            const result = await query(conn, "INSERT INTO storage SET ?", {id: key, value: value});
            return true;
        } catch (e) {
            this.pool.reset();
            throw e;
        }
    }
    async update(key, value) {
        try {
            const conn = await this.pool.connect();
            const result = await query(conn, "UPDATE storage SET value = ? WHERE id = ?", [value, key]);
            return true;
        } catch (e) {
            this.pool.reset();
            throw e;
        }
    }
}

exports.MysqlKV = MysqlKV;