const {Cache, AcceptorClient, Proposer} = require("gryadka");

const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

class KeyAlreadyExistsError {
    constructor() {
        this.core = this;
        this.isKeyAlreadyExistsError = true;
    }
    append() { return this; }
}

class NullUpdateError {
    constructor() {
        this.core = this;
        this.isNullUpdateError = true;
    }
    append() { return this; }
}

class CASError {
    constructor(version) {
        this.core = this;
        this.version = version;
        this.isCASError = true;
    }
    append() { return this; }
}

function init(value) {
    return function(state) {
        if (state == null) {
            return [{
                created: 0,
                modified: 0,
                value: value
            }, null];
        } else {
            return [state, new KeyAlreadyExistsError()]
        }
    }
}

function change(prevIndex, value) {
    return function(state) {
        if (state == null) {
            return [state, new NullUpdateError()]
        } else {
            if (prevIndex == state.modified) {
                return [{
                    created: state.created,
                    modified: prevIndex+1,
                    value: value
                }, null];
            } else {
                return [state, new CASError(state.modified)]
            }
        }
    }
}

class EtcdLikeAPI {
    constructor(settings) {
        this.settings = settings;
        this.cache = new Cache(this.settings.id);
        this.acceptors = this.settings.acceptors.map(x => new AcceptorClient(x));
        this.proposer = new Proposer(this.cache, this.acceptors, this.settings.quorum);
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
        // console.info("request /read:");
        // console.info(req.params);
        // console.info(req.query);

        const key = req.params.key;
        
        (async () => {
            try {
                let value = await this.proposer.changeQuery(key, x=>[x, null], x=>x, null);
                if (value.status == "OK") {
                    value = value.details;
                    if (value == null) {
                        console.info(404);
                        res.status(404).json({
                            "errorCode": 100,
                            "message": "Key not found",
                            "cause": "/" + key
                        });
                    } else {
                        //console.info(200);
                        res.status(200).json({
                            "action": "get",
                            "node": {
                                "createdIndex": value.created,
                                "key": "/" + key,
                                "modifiedIndex": value.modified,
                                "value": value.value
                            }
                        });
                    }
                } else {
                    console.info(value);
                    throw new Error(value);
                }
            } catch(e) {
                console.info(e);
                res.sendStatus(500);
            }
        })();
    }

    write(req, res) {
        // console.info("request /write:");
        // console.info(req.params);
        // console.info(req.query);
        // console.info(req.body);
        
        const key = req.params.key;
        const value = req.body.value;

        (async () => {
            try {
                if (req.query.hasOwnProperty("prevExist") && req.query.prevExist=="false") {
                    const status = await this.proposer.changeQuery(key, init(value), x=>x, null);
                    if (status.status == "OK") {
                        res.status(201).json({
                            "action": "create",
                            "node": {
                                "key": "/" + key,
                                "value": status.details.value,
                                "modifiedIndex": status.details.modified,
                                "createdIndex": status.details.created
                            }
                        });
                    } else if (status.status == "NO" && status.details.isKeyAlreadyExistsError) {
                        console.info(412);
                        res.status(412).json({
                            "errorCode": 105,
                            "message": "Key already exists",
                            "cause": "/" + key
                        });
                    } else {
                        console.info(status);
                        throw new Error();
                    }
                } else if (req.query.hasOwnProperty("prevIndex")) {
                    const prevIndex = parseInt(req.query.prevIndex);
                    const status = await this.proposer.changeQuery(key, change(prevIndex, value), x=>x, null);
                    if (status.status == "OK") {
                        res.status(200).json({
                            "action": "compareAndSwap",
                            "node": {
                                "key": "/" + key,
                                "value": status.details.value,
                                "modifiedIndex": status.details.modified,
                                "createdIndex": status.details.created
                            }
                        });
                    } else if (status.status == "NO" && status.details.isNullUpdateError) {
                        console.info(404);
                        res.status(404).json({
                            "errorCode": 100,
                            "message": "Key not found",
                            "cause": "/" + key
                        });
                    } else if (status.status == "NO" && status.details.isCASError) {
                        console.info(412);
                        res.status(412).json({
                            "errorCode": 101,
                            "message": "Compare failed",
                            "cause": `[${prevIndex} != ${status.details.version}]` 
                        });
                    } else {
                        throw new Error();
                    }
                }
            } catch(e) {
                //console.info(e);
                res.sendStatus(500);
            }
        })();
    }
    
    start() {
        this.acceptors.forEach(x => x.start());
        this.server = this.app.listen(this.settings.port);
    }

    close() {
        this.acceptors.forEach(x => x.close());
        this.server.close();
    }
}

const settings = JSON.parse(fs.readFileSync(process.argv[2]));
console.info(settings);

const service = new EtcdLikeAPI(settings);
service.start();