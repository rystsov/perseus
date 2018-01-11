const {MongoKV} = require("./MongoKV");
const {ResettablePool} = require("./ResettablePool");
const {EtcdLikeAPI} = require("./EtcdLikeAPI");

const service = new EtcdLikeAPI(
    new MongoKV(new ResettablePool(
        "mongodb://mongo1,mongo2,mongo3/?replicaSet=rs0"
    )),
    2379
);
service.start();
