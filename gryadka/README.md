Perseus is a set of scripts to test how Gryadka behaves when a leader is separated from the peer but maintain connection to the clients. It consists of scripts:

  * to init redis
  * to start redis as acceptors and the etcd-like gryadka's api
  * to generate load and measure a number of successful operations per second per node and per whole cluster

It's useless to measure the effect of a node failures when a client hosts a proposer because by design dead of one of acceptors doesn't affect proposers. For the sake of composition this module constains an Etcd-like service on top of Grydaka which is hosted on the same nodes as Redis. It makes this Gryadka deployment topology closer to the Etcd's, CockroachDB's and RethinkDB's topologies to use same methods for analysis.

The load generating script is pretty straightforward, it open connections to each of the nodes in the cluster and execute the following loop:

 1. read a value by a key
 2. if the wasn't set then set it to 0
 3. increment the value
 4. write it back
 5. increment a number of successful iterations 
 6. repeat the loop

Each connection uses its own key to avoid collision. If there is an error during the loop then it closes the current connection, opens a new one and begins the next iteration.

Once in a second the script dumps the number of successful iterations for the last second per cluster and per each node (metrics).

A user is expected to mess with the cluster and observe its effect of the metrics.

## Example of an output

The first column is the number of second since the begining of the experiment, the second column is the number of successful iterations per cluster, the last three columns represent the number of successful iterations per each node of the cluster.

<pre>
1	322	108	107	107
2	387	129	130	128
3	431	143	142	146
4	434	144	145	145
5	439	147	147	145
6	436	145	145	146
7	441	146	145	150</pre>

Grydka implements a leaderless replication protocol so death of the cluster doesn't have any effect on the cluster.

<pre>
182	435	147	143	145
183	435	146	144	145
184	412	116	148	148 # kill -9
185	296	0	149	147
186	309	0	154	155
187	289	0	145	144</pre>

Let's partition the leader with the iptables rules. The unavailability window is also zero:

<pre>
94	465	152	156	157
95	455	151	149	155
96	453	143	154	156 #iptables
97	318	0	157	161
98	292	0	144	148
99	290	0	144	146</pre>

## How to reproduce the test

Prerequisites: [jq](https://stedolan.github.io/jq/), [node-nightly](https://www.npmjs.com/package/node-nightly) and installed [redis](https://redis.io/) (redis-server on the PATH).

1. clone this repo
2. update etc/gryadka-cluster.json with the ip addresses of your set of nodes
3. commit 'n' push
4. on each of the nodes:
  1. clone your repo
  2. execute `./bin/init-redis.sh a1` (if you're on the a1 node)
  3. execute `./bin/init-proposer.sh p1` (replace p1 with pn if you're on the an node)
  4. start `redis-server deployment/a1/redis.conf`
  5. start `./bin/graydka deployment/p1.json`
5. clone your repo on the client and execute `./bin/test.sh` to start the test

### How to kill a node

1. ctrl-c + ctrl-c
2. `kill -9 ...`
3. Run `sudo iptables -A INPUT -s 10.0.0.5 -j DROP; sudo iptables -A INPUT -s 10.0.0.6 -j DROP; sudo iptables -A OUTPUT -d 10.0.0.5 -j DROP; sudo iptables -A OUTPUT -d 10.0.0.6 -j DROP` to separate current node from the rest of the cluster (10.0.0.5 and 10.0.0.6 in my case); run `sudo iptables -D INPUT -s 10.0.0.5 -j DROP; sudo iptables -D INPUT -s 10.0.0.6 -j DROP; sudo iptables -D OUTPUT -d 10.0.0.5 -j DROP; sudo iptables -D OUTPUT -d 10.0.0.6 -j DROP` to undo the effect