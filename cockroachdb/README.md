Perseus is a set of scripts to test how CockroachDB behaves when a leader is separated from the peer but maintain connection to the clients. It consists of scripts:

  * to download CockroachDB
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
1 360  99  94 167
2 458 129 120 209
3 493 139 128 226
4 469 136 120 213
5 486 136 130 220
6 478 136 130 212
7 488 142 124 222</pre>

You can see that everything looks normal. The next fragment represents a moment when I killed a leader the whole cluster became unavailable for 12 seconds until a new leader was elected:

<pre>
150 549 250 143 156
151 410 186 109 115 # kill -9
152   0   0   0   0
...                    
161   0   0   0   0
162 106   0 106   0
163 221   0 167  54
164 310   0 188 122</pre>

Since I didn't restart the second node (the former leader) it continued generating zero metrics.

Let's see what happens when the leader is isolated from the peers:

<pre>
70 474 140 122 212
71 484 137 135 212
72 284  81  78 125 #iptables down
73   0   0   0   0
...                 
80   0   0   0   0
81 182 130  52   0
82 309 195 114   0
83 342 216 126   0</pre>

The unavailability window is around 10 seconds.

## How to reproduce the test

Prerequisites: [jq](https://stedolan.github.io/jq/) and [node-nightly](https://www.npmjs.com/package/node-nightly).

1. clone this repo
2. update etc/roach-cluster.json with the ip addresses of your set of nodes
3. commit 'n' push
4. on each of the nodes:
  1. clone your repo
  2. execute `./bin/get-cockroach.sh` to download CockroachDB
  3. execute `./bin/run-cockroach.sh roach1` (if you're on a node with an address corresponding to roach1 in your etc/roach-cluster.json)
5. clone your repo on the client and execute:
  1. `./bin/init-lily.sh roach1` to initialize the db
  2. `./bin/test.sh` to start the test

### How to kill a node

1. ctrl-c + ctrl-c
2. `kill -9 ...`
3. Run `sudo iptables -A INPUT -s 10.0.0.5 -j DROP; sudo iptables -A INPUT -s 10.0.0.6 -j DROP; sudo iptables -A OUTPUT -d 10.0.0.5 -j DROP; sudo iptables -A OUTPUT -d 10.0.0.6 -j DROP` to separate current node from the rest of the cluster (10.0.0.5 and 10.0.0.6 in my case); run `sudo iptables -D INPUT -s 10.0.0.5 -j DROP; sudo iptables -D INPUT -s 10.0.0.6 -j DROP; sudo iptables -D OUTPUT -d 10.0.0.5 -j DROP; sudo iptables -D OUTPUT -d 10.0.0.6 -j DROP` to undo the effect