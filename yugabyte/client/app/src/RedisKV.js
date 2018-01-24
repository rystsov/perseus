const redis = require("redis");
const Promise = require("bluebird");
Promise.promisifyAll(redis.RedisClient.prototype);

class RedisKV {
    constructor(id, host, port) {
        this.host = host;
        this.port = port;
        this.id = id;
    }
    async read(key) {
        try {
            const client = await this.connect();
            return await client.getAsync(key)
        } catch (e) {
            this.reset();
            throw e;
        }
    }
    async create(key, val) {
        try {
            const client = await this.connect();
            await client.setAsync(key, val);
            return true;
        } catch (e) {
            this.reset();
            throw e;
        }
    }
    async update(key, val) {
        try {
            const client = await this.connect();
            await client.setAsync(key, val);
            return true;
        } catch (e) {
            this.reset();
            throw e;
        }
    }

    connect() {
        return new Promise((respond, reject) => {
            if (this.client != null) {
                respond(this.client);
            } else {
                this.client = redis.createClient(
                    {port: this.port, host: this.host, retry_strategy: options=>2000}
                );
                respond(this.client);
            }
        });
    }

    reset() {
        if (this.client != null) {
            try { this.client.quit(); } catch(e) { }
            this.client = null;
        }
    }
}


exports.RedisKV = RedisKV;