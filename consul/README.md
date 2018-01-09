Perseus/Consul is a set of scripts to investigate responsiveness of a Consul cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log` (3.2.13):

<pre>#legend: time|consul1|consul2|consul3|consul1:err|consul2:err|consul3:err
1	54	48	50	0	0	0	2018/01/09 08:49:58
2	53	49	50	0	0	0	2018/01/09 08:49:59
...
25	56	50	52	0	0	0	2018/01/09 08:50:22
26	63	59	59	0	0	0	2018/01/09 08:50:23
# isolating consul1
# isolated consul1
27	23	25	24	0	0	0	2018/01/09 08:50:24
28	0	0	0	1	1	1	2018/01/09 08:50:25
...
40	0	0	0	0	1	1	2018/01/09 08:50:37
41	0	0	0	0	1	1	2018/01/09 08:50:38
42	0	13	0	0	1	1	2018/01/09 08:50:39
43	0	83	73	1	0	0	2018/01/09 08:50:40
44	0	81	94	1	0	0	2018/01/09 08:50:41
...
67	0	84	84	1	0	0	2018/01/09 08:51:04
68	0	83	93	1	0	0	2018/01/09 08:51:05
# rejoining consul1
# rejoined consul1
69	0	76	88	1	0	0	2018/01/09 08:51:06
70	0	5	5	1	0	0	2018/01/09 08:51:07
71	0	0	0	1	1	1	2018/01/09 08:51:08
...
77	0	0	0	1	1	1	2018/01/09 08:51:14
78	0	0	0	1	1	1	2018/01/09 08:51:15
79	22	45	27	1	1	1	2018/01/09 08:51:16
80	50	51	57	0	0	0	2018/01/09 08:51:17</pre>

The first column is the number of second since the begining of the experiment, the following last three columns represent the number of increments per each node of the cluster per second, the next triplet is number of errors per second and the last is time.

The all zero row means that all connections hang.

## How to use Perseus?

Clone this repository:

    git clone https://github.com/rystsov/perseus.git

Switch to Consul folder:

    cd perseus/consul

Run the consul cluster (3 nodes):

    docker-compose up

Open new tab, build and run a client's container

    ./build-client.sh && ./run-client1.sh

You'll see an output similar to `logs/client1.log` but without isolating/rejoin markers (the log still has them).

Then use the `./isolate.sh consul1` to isolate `consul1` (you can use `consul2`, `consul3` too). To rejoin `consul1` to the cluster use  `./rejoin.sh consul1`