const r = require("rethinkdb");

class ResettablePool {
    constructor(config) {
        this.config = config;
        this.conn = null;
        this.hostPort = config.host + ":" + config.port;
    }

    async connect() {
        return new Promise((respond, reject) => {
            if (this.conn != null) {
                respond(this.conn);
            } else {
                r.connect(this.config, (err, conn) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.conn = conn;
                        respond(this.conn);
                    }
                });
            }
        });
    }

    async reset() {
        if (this.conn != null) {
            try {
                await this.conn.close({ noreplyWait: false })
            } catch(e) {}
            this.conn = null;
        }
    }
}

exports.ResettablePool = ResettablePool;