Perseus is a set of scripts to test how distributed databases behaves when a leader is separated from the peer but maintain connection to the clients. 

| Database | Crashed leader | Isolated leader |
| --- | --- | --- |
| [CockroachDB](https://github.com/rystsov/perseus/tree/master/cockroachdb) | 10 seconds | - |
| [Etcd](https://github.com/rystsov/perseus/tree/master/etcd) | 2 seconds | 2 seconds |
| [RethinkDB](https://github.com/rystsov/perseus/tree/master/rethinkdb) | 0.6 seconds | 15 seconds |

**Crashed leader:** duration of an unavailability window caused by a crashed leader (kill -9)

**Isolated leader:** duration of an unavailability window caused by a leader isolated from the peers by a network partitioning (iptables)