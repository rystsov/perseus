const mysql = require('mysql');

class ResettablePool {
    constructor(config, hostPort) {
        this.config = config;
        this.conn = null;
        this.hostPort = hostPort;
    }

    connect() {
        return new Promise((respond, reject) => {
            if (this.conn != null) {
                respond(this.conn);
            } else {
                const conn = mysql.createConnection(this.config);
                conn.connect(err =>{
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

    reset() {
        if (this.conn != null) {
            try {
                this.conn.destroy();
            } catch(e) {}
            this.conn = null;
        }
    }
}

exports.ResettablePool = ResettablePool;