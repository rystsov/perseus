Perseus is a set of scripts to investigate a distributed database's responsiveness when one of its three nodes is isolated from the peers

| Database | Downtime on isolation | Partial downtime on isolation | Disturbance time | Downtime on recovery | Partial downtime on recovery | Recovery time | Version |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [Etcd](https://github.com/rystsov/perseus/tree/master/etcd) | 1s | 0s | 1s | 1s | 0s | 2s | 3.2.13 |
| [Gryadka](https://github.com/rystsov/perseus/tree/master/gryadka) | 0s | 0s | 0s | 0s | 0s | 8s | gryadka: 1.61.8<br/> redis: 4.0.1 |
| [CockroachDB](https://github.com/rystsov/perseus/tree/master/cockroachdb) | 7s | 19s | 26s | 7s | 0s | 13s | 1.1.3 |
| [Consul](https://github.com/rystsov/perseus/tree/master/consul) | 14s | 1s | 15s | 8s | 0s | 10s | 1.0.2 |
| [RethinkDB](https://github.com/rystsov/perseus/tree/master/rethinkdb) | 17s | 0s | 17s | 0s | 0s | 21s | 2.3.6 |
| [MongoDB](https://github.com/rystsov/perseus/tree/master/mongodb) (1) | 29s | 0s | 29s | 0s | 0s | 1s | 3.6.1 |
| [MongoDB](https://github.com/rystsov/perseus/tree/master/mongodb) (2) | 117s | 0s | 117s | 0s | 0s | 38s | 3.6.1 |
| [MongoDB](https://github.com/rystsov/perseus/tree/master/mongodb) (3) | 29s | 0s | 29s | 0s | 0s | N/A | 3.6.1 |
| [TiDB](https://github.com/rystsov/perseus/tree/master/tidb) (1) | 15s | 1s | 16s | 82s | 8s | 114s | PD: 1.1.0<br/>KV: 1.0.1<br/>DB: 1.1.0 |
| [TiDB](https://github.com/rystsov/perseus/tree/master/tidb) (2) | &#8734; | 0 | N/A | &#8734; | 0 | N/A | same |

**Downtime on isolation:** Complete unavailability (all three nodes are unavailable to write/read) on a transition from steady three nodes to steady two nodes caused by isolation of the third

**Partial downtime on isolation** Only one node is available on the 3-to-2 transition

**Disturbance time** Time bewteen the isolation and two nodes became steady

**Downtime on recovery:** Complete unavailability on the transition from steady two nodes to steady three nodes caused by rejoining of the missing node

**Partial downtime on recovery:** Only one node is available on the 2-to-3 transition

**Recovery time:** Time between connectivity is restored and all three nodes are available to write and read

### So, this is just a bunch of numbers based on the default parameters such as leader election timeout of various systems, isn't it?

Kind of, but there are anyway lot of interesting patterns behind the numbers.

Some systems have downtime on recovery, and some don't, TiDB has partial downtime on recovery and others don't. [Gryadka](https://github.com/gryadka/js) doesn't even have downtime on isolation, so testing "defaults" helps to understand the fundamental properties of the replication algorithms each system uses.

### Why there are three records for MongoDB?

I didn't manage to achieve stable results with MongoDB. Sometimes it behaved like any other leader-based system: isolation of a leader led to a temporary cluster-wide downtime and then to two steady working node, once a connection was restored all three nodes were working as usual. Sometimes it had issues:

  1. The downtime lasted almost two minutes and once it finished the RPS dropped from 282 before the isolation starter to less than one.
  2. A client on an isolated node couldn't connect to a cluster even after a connection was restored.

I fired a bug for every issue [1](https://jira.mongodb.org/browse/SERVER-32703) and [2](https://jira.mongodb.org/browse/SERVER-32699).

### Why there are two records for TiDB?

When TiDB starts it works in a "warm-up" mode, however from a client perspective, it's indistinguishable from "normal" mode, so there are two records.

If a node became isolated during the "warm-up" mode, then the whole cluster became unavailable. Moreover, it doesn't recover even when a connection is restored. I fired a corresponding bug: https://github.com/pingcap/tidb/issues/2676.

N.B. When TiDB is a "warm-up" mode, the replication factor is one, so it's possible to lose acknowledged data in case of death of a single node.