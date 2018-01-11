class MongoKV {
    constructor(pool) {
        this.pool = pool;
    }
    async read(key) {
        try {
            const client = await this.pool.connect();
            const db = client.db("lily");
            const collection = db.collection("storage");
            
            const data = await collection.find(
                {"key": key},
                { readConcern: { level: "linearizable" } }
            ).toArray();
            if (data.length==0) {
                return null;
            } else {
                return data[0].val;
            }
        } catch (e) {
            this.pool.reset();
            throw e;
        }
    }
    async create(key, val) {
        try {
            const client = await this.pool.connect();
            const db = client.db("lily");
            const collection = db.collection("storage");
            
            await collection.insertOne({
                "key": key,
                "val": val
            }, { writeConcern: { w: "majority" } });
        } catch (e) {
            this.pool.reset();
            throw e;
        }
    }
    async update(key, val) {
        try {
            const client = await this.pool.connect();
            const db = client.db("lily");
            const collection = db.collection("storage");
            
            await collection.updateOne(
                {"key": key}, {$set: {"val": val}},
                { writeConcern: { w: "majority" } }
            );
        } catch (e) {
            this.pool.reset();
            throw e;
        }
    }
}

exports.MongoKV = MongoKV;