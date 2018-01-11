const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

class EtcdLikeAPI {
    constructor(kv, port) {
        this.kv = kv;
        this.port = port;
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: true }));
        const router = express.Router();

        router.route("/v2/keys/:key").get((req, res) => {
            this.read(req, res);
        });
        router.route("/v2/keys/:key").put((req, res) => {
            this.write(req, res);
        });

        this.app.use('/', router);
    }

    read(req, res) {
        const key = req.params.key;
        
        (async () => {
            try {
                let value = await this.kv.read(key);
                if (value == null) {
                    console.info(404);
                    res.status(404).json({
                        "errorCode": 100,
                        "message": "Key not found",
                        "cause": "/" + key
                    });
                } else {
                    res.status(200).json({
                        "action": "get",
                        "node": {
                            "createdIndex": 0,
                            "key": "/" + key,
                            "modifiedIndex": 0,
                            "value": value
                        }
                    });
                }
            } catch(e) {
                console.info(e);
                res.sendStatus(500);
            }
        })();
    }

    write(req, res) {
        const key = req.params.key;
        const value = req.body.value;

        (async () => {
            try {
                if (req.query.hasOwnProperty("prevExist") && req.query.prevExist=="false") {
                    await this.kv.create(key, value);
                    res.status(201).json({
                        "action": "create",
                        "node": {
                            "key": "/" + key,
                            "value": value,
                            "modifiedIndex": 0,
                            "createdIndex": 0
                        }
                    });
                } else if (req.query.hasOwnProperty("prevIndex")) {
                    throw new Error("TODO: prevIndex");
                } else {
                    await this.kv.update(key, value);
                    res.status(200).json({
                        "action": "update",
                        "node": {
                            "key": "/" + key,
                            "value": value,
                            "modifiedIndex": 0,
                            "createdIndex": 0
                        }
                    });
                }
            } catch(e) {
                res.sendStatus(500);
            }
        })();
    }
    
    start() {
        this.server = this.app.listen(this.port);
    }

    close() {
        this.server.close();
    }
}

exports.EtcdLikeAPI = EtcdLikeAPI;
