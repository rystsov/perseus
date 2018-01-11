Perseus is a set of scripts to investigate a distributed database's responsiveness when one of its three nodes is isolated from the peers

| Database | Complete unavailability | Unexpected unavailability | Recovery time | Version |
| --- | --- | --- | --- | --- |
| [Etcd](https://github.com/rystsov/perseus/tree/master/etcd) | 1s | 1s | 2s | 3.2.13 |
| [MongoDB](https://github.com/rystsov/perseus/tree/master/mongodb) | 28s | 28s | 1s | v3.6.1 |
| [Gryadka](https://github.com/rystsov/perseus/tree/master/gryadka) | 0s | 0s | 8s | gryadka: 1.61.8<br/> redis: 4.0.1 |
| [CockroachDB](https://github.com/rystsov/perseus/tree/master/cockroachdb) | 14s | 33s | 13s | v1.1.3 |
| [Consul](https://github.com/rystsov/perseus/tree/master/consul) | 22s | 23s | 10s | v1.0.2 |
| [TiDB](https://github.com/rystsov/perseus/tree/master/tidb) | 58s | 1m38s | 1m2s | PD: v1.1.0-alpha-54-g5598c00<br/>TiKV: 1.0.1<br/>TiDB: v1.1.0-alpha-357-gb1e1a26 |
| [RethinkDB](https://github.com/rystsov/perseus/tree/master/rethinkdb) | 17s | 17s | 21s | 2.3.6~0zesty |

**Complete unavailability:** all three nodes are unavailable to write/read

**Unexpected unavailability:** more than one node are unavailable to write/read (complete unavailability is a sub-type of complete unavailability)

**Recovery time:** time between connectivity is restored and all three nodes are available to write/read