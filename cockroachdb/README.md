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
1	452	220	139	93
2	510	246	154	110
3	491	233	153	105
4	502	240	156	106
5	491	237	153	101
6	485	234	148	103
7	485	230	148	107</pre>

You can see that everything looks normal. The next fragment represents a moment when I killed a random node. It seems that it was a follower so nothing bad happed. As a expected the number of successful iterations per that node dropped to zero:

<pre>
147	482	148	237	97
148	481	146	237	98
149	434	105	234	95
150	281	0	192	89
151	289	0	203	86
152	287	0	197	90</pre>

After I restarted that node the metrics come back to normal:

<pre>
162	295	0	205	90
163	291	0	201	90
164	299	5	204	90
165	395	54	243	98
166	387	54	236	97
167	384	53	238	93</pre>

When I killed a leader the whole cluster became unavailable for 10 seconds until a new leader was elected:

<pre>
178	381	51	236	94
179	377	51	232	94
180	208	50	72	86
181	0	0	0	0
182	0	0	0	0
...
189	0	0	0	0
190	0	0	0	0
191	38	33	0	5
192	141	43	0	98
193	142	43	0	99</pre>

Since I didn't restart the second node (the former leader) it continued generating zero metrics.

## How to reproduce the test

Prerequisites: [jq](https://stedolan.github.io/jq/) and [node-nightly](https://www.npmjs.com/package/node-nightly).

1. clone this repo
2. update etc/roach-cluster.json with the ip addresses of your set of nodes
3. commit 'n' push
4. on each of the nodes:
  1. clone your repo
  2. run `./bin/get-cockroach.sh` to download CockroachDB
  3. run `./bin/run-cockroach.sh roach1` (if you're on a node with an address corresponding to roach1 in your etc/roach-cluster.json)
5. run `./bin/init-lily.sh roach1` on the roach1 node to initialize a db
6. clone your repo on your client node, run `npm install` and then `./bin/test.sh` to start the test

### How to kill a node

1. ctrl-c + ctrl-c
2. `kill -9 ...`
3. Run `sudo iptables -A INPUT -s 10.0.0.5 -j DROP; sudo iptables -A INPUT -s 10.0.0.6 -j DROP; sudo iptables -A OUTPUT -d 10.0.0.5 -j DROP; sudo iptables -A OUTPUT -d 10.0.0.6 -j DROP` to separate current node from the rest of the cluster (10.0.0.5 and 10.0.0.6 in my case); run `sudo iptables -D INPUT -s 10.0.0.5 -j DROP; sudo iptables -D INPUT -s 10.0.0.6 -j DROP; sudo iptables -D OUTPUT -d 10.0.0.5 -j DROP; sudo iptables -D OUTPUT -d 10.0.0.6 -j DROP` to undo the effect