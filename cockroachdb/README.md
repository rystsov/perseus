Perseus/CockroachDB is a set of scripts to investigate responsiveness of a CockroachDB cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log` (v1.1.3):

<pre>#legend: time|roach1|roach2|roach3|roach1:err|roach2:err|roach3:err
1	60	72	59	0	0	0	2018/01/08 05:31:33
2	59	69	67	0	0	0	2018/01/08 05:31:34
...
29	70	100	62	0	0	0	2018/01/08 05:32:01
30	63	87	68	0	0	0	2018/01/08 05:32:02
# isolating roach2
# isolated roach2
31	37	46	35	0	0	0	2018/01/08 05:32:03
32	0	0	0	0	0	0	2018/01/08 05:32:04
...
38	0	0	0	0	0	0	2018/01/08 05:32:10
39	0	0	178	0	0	1	2018/01/08 05:32:11
40	0	0	206	0	0	0	2018/01/08 05:32:12
...
57	0	0	192	0	0	0	2018/01/08 05:32:29
58	86	0	133	0	0	0	2018/01/08 05:32:30
...
88	102	0	133	0	0	0	2018/01/08 05:33:00
89	102	0	135	0	0	0	2018/01/08 05:33:01
# rejoining roach2
# rejoined roach2
90	99	0	120	0	0	0	2018/01/08 05:33:02
...
93	91	0	122	0	0	0	2018/01/08 05:33:05
94	67	0	87	0	0	0	2018/01/08 05:33:06
95	0	0	0	0	0	0	2018/01/08 05:33:07
...
101	0	0	0	0	0	0	2018/01/08 05:33:13
102	10	0	1	0	0	0	2018/01/08 05:33:14
103	66	62	81	0	1	0	2018/01/08 05:33:15
104	73	70	80	0	0	0	2018/01/08 05:33:16</pre>

The first column is the number of second since the begining of the experiment, the following last three columns represent the number of increments per each node of the cluster per second, the next triplet is number of errors per second and the last is time.

The all zero row means that all connections hang.

## How to use Perseus?

Clone this repository:

    git clone https://github.com/rystsov/perseus.git

Switch to CockroachDB folder:

    cd perseus/cockroachdb

Run the cockroachdb cluster (3 nodes):

    docker-compose up

Open new tab, build and run a client's container

    ./build-client.sh && ./run-client1.sh

You'll see an output similar to `logs/client1.log` but without isolating/rejoin markers (the log still has them).

Then use the `./isolate.sh roach1` to isolate `roach1` (you can use `roach2`, `roach3` too). To rejoin `roach1` to the cluster use  `./rejoin.sh roach1`