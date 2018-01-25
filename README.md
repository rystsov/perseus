Perseus is a set of scripts to investigate a distributed database's responsiveness when one of its three nodes is isolated from the peers

| Database | Downtime on isolation | Partial downtime on isolation | Disturbance time | Downtime on recovery | Partial downtime on recovery | Recovery time | Version |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [Etcd](https://github.com/rystsov/perseus/tree/master/etcd) | 1s | 0s | 1s | 1s | 0s | 2s | 3.2.13 |
| [Gryadka](https://github.com/rystsov/perseus/tree/master/gryadka) | 0s | 0s | 0s | 0s | 0s | 5s | gryadka: 1.61.8<br/> redis: 4.0.1 |
| [CockroachDB](https://github.com/rystsov/perseus/tree/master/cockroachdb) | 7s | 19s | 26s | 7s | 0s | 13s | 1.1.3 |
| [Consul](https://github.com/rystsov/perseus/tree/master/consul) | 14s | 1s | 15s | 8s | 0s | 10s | 1.0.2 |
| [RethinkDB](https://github.com/rystsov/perseus/tree/master/rethinkdb) | 17s | 0s | 17s | 0s | 0s | 21s | 2.3.6 |
| [MongoDB](https://github.com/rystsov/perseus/tree/master/mongodb) (1) | 29s | 0s | 29s | 0s | 0s | 1s | 3.6.1 |
| [MongoDB](https://github.com/rystsov/perseus/tree/master/mongodb) (2) | 117s | 0s | 117s | 0s | 0s | N/A | 3.6.1 |
| [MongoDB](https://github.com/rystsov/perseus/tree/master/mongodb) (3) | 29s | 0s | 29s | 0s | 0s | N/A | 3.6.1 |
| [TiDB](https://github.com/rystsov/perseus/tree/master/tidb) (1) | 15s | 1s | 16s | 82s | 8s | 114s | PD: 1.1.0<br/>KV: 1.0.1<br/>DB: 1.1.0 |
| [TiDB](https://github.com/rystsov/perseus/tree/master/tidb) (2) | &#8734; (>235s) | 0 | N/A | &#8734; (>89s) | 0 | N/A | same |
| [YugaByte](https://github.com/rystsov/perseus/tree/master/yugabyte) | &#8734; (>366s) | 0 | N/A | 51s | 0 | 51s | 0.9.1.0 |

**Downtime on isolation:** Complete unavailability (all three nodes are unavailable to write/read) on a transition from steady three nodes to steady two nodes caused by isolation of the third

**Partial downtime on isolation** Only one node is available on the 3-to-2 transition

**Disturbance time** Time bewteen the isolation and two nodes became steady

**Downtime on recovery:** Complete unavailability on the transition from steady two nodes to steady three nodes caused by rejoining of the missing node

**Partial downtime on recovery:** Only one node is available on the 2-to-3 transition

**Recovery time:** Time between connectivity is restored and all three nodes are available to write and read

### What were tested?

All the testing systems have something similar. They are distributed consistent databases (key-value storages) which tolerates up to `n` failure of `2n+1` nodes. 

This testing suite uses a three nodes configuration with a fourth node acting as a client. The client spawns three threads (coroutines). Each thread opens a connection to one of the three DB's node and in loop reads, increments and writes a value back.

Once in a second it dumps an aggregated statistic in the following form:

<pre>#legend: time|gryadka1|gryadka2|gryadka3|gryadka1:err|gryadka2:err|gryadka3:err
1	128	175	166	0	0	0	2018/01/16 09:02:41
2	288	337	386	0	0	0	2018/01/16 09:02:42
...
18	419	490	439	0	0	0	2018/01/16 09:02:58
19	447	465	511	0	0	0	2018/01/16 09:02:59</pre>

> The first column is the number of seconds since the beginning of the experiment; the following three columns represent the number of increments per each node of the cluster per second, the next triplet is the number of errors per second, and the last one is time.

In case of MongoDB and Gryadka you can't control to which node a client connects and need to specify addresses of all nodes in a connection string, so each DB's replica has a colocated client (read-modify-write loop) while the fourth node was only responsible for aggregation of statistics and dumping it every second.

During a test, I isolated one of the DB's nodes from it peers and observed how it affected the outcome. Thanks to Docker Compose the tests are reproducible just with a couple of commands, navigate to a DB's subfolder to see instructions.

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

### What's wrong with YugaByte?

https://github.com/YugaByte/yugabyte-db/issues/19

### What's Gryadka?

[Gryadka](https://github.com/gryadka/js) is an experimental key/value storage. I created it as a demonstration that Paxos isn't hard as its reputation. Be careful! It isn't production ready, the best way to use it is to read sources (less than 500 lines of code) and write your implementation.