const r = require("rethinkdb");

class RethinkKV {
    constructor(pool, table, id) {
        this.pool = pool;
        this.table = table;
        this.id = id;
    }
    async read(key) {
        try {
            const conn = await this.pool.connect();
            const value = await r.table(this.table).get(key).run(conn);
            return value == null ? null: value.value;
        } catch (e) {
            this.pool.reset();
            throw e;
        }
    }
    async create(key, value) {
        try {
            const conn = await this.pool.connect();
            const info = await r.table(this.table).insert({ 
                id: key,
                value: value
            }, {durability: "hard", returnChanges: false}).run(conn);
            if (info.inserted != 1) {
                throw new Error();
            }
            return true;
        } catch (e) {
            this.pool.reset();
            throw e;
        }
    }
    async update(key, value) {
        try {
            const conn = await this.pool.connect();
            const info = await r.table(this.table).get(key).update({
                value: value
            }, {durability: "hard", returnChanges: false, nonAtomic: false}).run(conn);
            if (info.replaced != 1) {
                throw new Error();
            }
            return true;
        } catch (e) {
            this.pool.reset();
            throw e;
        }
    }
}

exports.RethinkKV = RethinkKV;