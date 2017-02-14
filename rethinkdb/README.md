Perseus is a set of scripts to test how RethinkDB behaves when a leader is separated from the peer but maintain connection to the clients. It consists of scripts:

  * to download RethinkDB
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
1	673	209	198	266
2	739	226	224	289
3	728	217	217	294
4	761	237	219	305
5	714	214	211	289
6	758	232	219	307
7	745	224	221	300</pre>

1 second precision isn't enough to measure how death of the leader affects the cluster:

<pre>
13	711	214	211	286
14	748	222	222	304
15	544	165	167	212 # kill -9
16	278	158	120	0
17	448	248	200	0
18	445	247	198	0</pre>

Let's repeat it with 10x precision (each tick represents 100 ms now):

<pre>
179	68	21	21	26
180	61	20	19	22  # kill -9
181	0	0	0	0
182	0	0	0	0
183	0	0	0	0
184	0	0	0	0
185	0	0	0	0
186	0	0	0	0
187	41	23	18	0
188	42	23	19	0</pre>

As you can see the unavailability window is 600 ms.

Let's partition the leader with the iptables rules. The unavailability window is 15 seconds:

<pre>
90	725	217	226	282
91	763	227	229	307
92	57	16	17	24  # iptables
93	0	0	0	0
94	0	0	0	0
95	0	0	0	0
96	0	0	0	0
97	0	0	0	0
98	0	0	0	0
99	0	0	0	0
100	0	0	0	0
101	0	0	0	0
102	0	0	0	0
103	0	0	0	0
104	0	0	0	0
105	0	0	0	0
106	0	0	0	0
107	0	0	0	0
108	386	223	163	0
109	458	259	199	0</pre>

## How to reproduce the test

Prerequisites: [jq](https://stedolan.github.io/jq/) and [node-nightly](https://www.npmjs.com/package/node-nightly).

1. clone this repo
2. update etc/rethink-cluster.json with the ip addresses of your set of nodes
3. commit 'n' push
4. on each of the nodes:
  1. clone your repo
  2. execute `./bin/get-rethink-ubuntu.sh` to download Etcd
  3. execute `./bin/run-rethink.sh rethink1` (if you're on the ectd1 node, use use rethink2 or rethink3 on others)
5. clone your repo on the client and execute:
  1. `./bin/init-lily.sh rethink1` to init the db
  2. `./bin/test.sh` to start the test

### How to kill a node

1. ctrl-c + ctrl-c
2. `kill -9 ...`
3. Run `sudo iptables -A INPUT -s 10.0.0.5 -j DROP; sudo iptables -A INPUT -s 10.0.0.6 -j DROP; sudo iptables -A OUTPUT -d 10.0.0.5 -j DROP; sudo iptables -A OUTPUT -d 10.0.0.6 -j DROP` to separate current node from the rest of the cluster (10.0.0.5 and 10.0.0.6 in my case); run `sudo iptables -D INPUT -s 10.0.0.5 -j DROP; sudo iptables -D INPUT -s 10.0.0.6 -j DROP; sudo iptables -D OUTPUT -d 10.0.0.5 -j DROP; sudo iptables -D OUTPUT -d 10.0.0.6 -j DROP` to undo the effect