Perseus is a set of scripts to test how TiDB behaves when a leader is separated from the peer but maintain connection to the clients. It consists of scripts:

  * to download TiDB
  * to run it
  * to generate load and measure a number of successful operations per second per node and per whole cluster

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
1	351	152	105	94
2	435	189	123	123
3	464	209	133	122
4	467	210	131	126
5	524	231	147	146
6	490	216	140	134
7	475	207	135	133</pre>

You can see that everything looks normal. The next fragment represents a moment when I killed a leader node. The cluster became unavailable for **18 seconds**, when it recovered all the nodes but the killed one continued serving requests:

<pre>
500	501	142	198	161
501	476	134	192	150 #kill -9
502	133	37	54	42
503	0	0	0	0
504	0	0	0	0
...
516	0	0	0	0
517	0	0	0	0
518	57	56	0	1
519	211	146	0	65
520	294	163	0	131</pre>

After I started the killed node it started serving requests as well:

<pre>
548	314	171	0	143
549	325	177	0	148
550	312	173	0	139
551	344	175	25	144
552	484	186	138	160
553	489	188	140	161
554	452	175	128	149</pre>

After I isolated the leader from the peers with iptables the unavailability window lasted **2 minutes 40 seconds**:

<pre>
86	445	195	126	124
87	474	214	132	128 # iptables down
88	19	8	5	6
89	0	0	0	0
...
247	0	0	0	0
248	29	0	0	29
249	237	0	138	99
250	289	0	179	110
251	314	0	197	117</pre>

## How to reproduce the test

Prerequisites: [jq](https://stedolan.github.io/jq/), [node-nightly](https://www.npmjs.com/package/node-nightly) and mysql-client.

1. clone this repo
2. update etc/tidb-cluster.json with the ip addresses of your set of nodes
3. commit 'n' push
4. on each of the nodes (tidb1, tidb2 or tidb3):
  1. clone your repo
  2. execute `./bin/get-tidb.sh` to download TiDB
  3. execute `./bin/run-pd.sh tidb1` (if you're on the tidb1 node, use use tidb2 or tidb3 on others)
  4. execute `./bin/run-kv.sh tidb1`
  5. execute `./bin/run-db.sh tidb1`
5. clone your repo on the client and execute:
  1. `./bin/init-lily.sh tidb1` to init the db
  2. `./bin/test.sh` to start the test

### How to kill a node

1. ctrl-c + ctrl-c
2. `kill -9 ...`
3. Run `sudo iptables -A INPUT -s 10.0.0.5 -j DROP; sudo iptables -A INPUT -s 10.0.0.6 -j DROP; sudo iptables -A OUTPUT -d 10.0.0.5 -j DROP; sudo iptables -A OUTPUT -d 10.0.0.6 -j DROP` to separate current node from the rest of the cluster (10.0.0.5 and 10.0.0.6 in my case); run `sudo iptables -D INPUT -s 10.0.0.5 -j DROP; sudo iptables -D INPUT -s 10.0.0.6 -j DROP; sudo iptables -D OUTPUT -d 10.0.0.5 -j DROP; sudo iptables -D OUTPUT -d 10.0.0.6 -j DROP` to undo the effect