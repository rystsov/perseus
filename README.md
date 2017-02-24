Perseus is a set of scripts to test how distributed databases behaves when a leader is separated from the peer but maintain connection to the clients. 

| Database | Crashed leader | Isolated leader | Version |
| --- | --- | --- | --- |
| [TiDB](https://github.com/rystsov/perseus/tree/master/tidb) | 18s | [BUG](https://github.com/pingcap/tidb/issues/2676): 2m 40s | pd-server: f5744d7b52aa4793b84cfdcd4efae1fc9a9bac6b<br/> tikv-server: eb185b3babc476080306fef7c05b7673c1342455<br/> tidb-server: a8d185d8cb8485e1a124919d0df8b10a16bc6e40 |
| [CockroachDB](https://github.com/rystsov/perseus/tree/master/cockroachdb) | 12s | 10s | beta-20170223 |
| [RethinkDB](https://github.com/rystsov/perseus/tree/master/rethinkdb) | 0.6s | 15s | rethinkdb 2.3.5~0xenial (GCC 5.3.1) |
| [Etcd](https://github.com/rystsov/perseus/tree/master/etcd) | 2s | 2s | 3.1.0 (8ba2897) |
| [Gryadka](https://github.com/rystsov/perseus/tree/master/gryadka) | 0s | 0s | 1.61.8, Redis: 3.2.8 (11aa79fd2425bed9) |

**Crashed leader:** duration of an unavailability window caused by a crashed leader (kill -9)

**Isolated leader:** duration of an unavailability window caused by a leader isolated from the peers by a network partitioning (iptables)