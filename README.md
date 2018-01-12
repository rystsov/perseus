Perseus is a set of scripts to investigate a distributed database's responsiveness when one of its three nodes is isolated from the peers

| Database | Downtime on isolation | Partial downtime on isolation | Disturbance time | Downtime on recovery | Partial downtime on recovery | Recovery time | Version |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [Etcd](https://github.com/rystsov/perseus/tree/master/etcd) | 1s | 0s | 1s | 1s | 0s | 2s | 3.2.13 |
| [MongoDB](https://github.com/rystsov/perseus/tree/master/mongodb) | 28s | 0s | 28s | 0s | 0s | 1s | 3.6.1 |
| [Gryadka](https://github.com/rystsov/perseus/tree/master/gryadka) | 0s | 0s | 0s | 0s | 0s | 8s | gryadka: 1.61.8<br/> redis: 4.0.1 |
| [CockroachDB](https://github.com/rystsov/perseus/tree/master/cockroachdb) | 7s | 19s | 26s | 7s | 0s | 13s | 1.1.3 |
| [Consul](https://github.com/rystsov/perseus/tree/master/consul) | 14s | 1s | 15s | 8s | 0s | 10s | 1.0.2 |
| [TiDB](https://github.com/rystsov/perseus/tree/master/tidb) | 19s | 40s | 59s | 38s | 1s | 61s | PD: 1.1.0<br/>TiKV: 1.0.1<br/>TiDB: 1.1.0 |
| [RethinkDB](https://github.com/rystsov/perseus/tree/master/rethinkdb) | 17s | 0s | 17s | 0s | 0s | 21s | 2.3.6 |

**Downtime on isolation:** Complete unavailability (all three nodes are unavailable to write/read) on a transition from steady three nodes to steady two nodes caused by isolation of the third

**Partial downtime on isolation** Only one node is available on the 3-to-2 transition

**Disturbance time** Time bewteen the isolation and two nodes became steady

**Downtime on recovery:** Complete unavailability on the transition from steady two nodes to steady three nodes caused by rejoining of the missing node

**Partial downtime on recovery:** Only one node is available on the 2-to-3 transition

**Recovery time:** Time between connectivity is restored and all three nodes are available to write and read

### So, this is just a bunch of numbers based on the default parameters such as leader election timeout of various systems, isn't it?

Kind of, but there are anyway lot of interesting patterns behind the numbers.