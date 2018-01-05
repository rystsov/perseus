Perseus/CockroachDB is a set of scripts to investigate responsiveness of a CockroachDB cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log`:

<pre>#legend: time|roach1|roach2|roach3|roach1:err|roach2:err|roach3:err
1	57	54	65	0	0	0	2018/01/04 05:22:38
2	57	67	66	0	0	0	2018/01/04 05:22:39
...
13	40	44	52	0	0	0	2018/01/04 05:22:50
14	51	61	77	0	0	0	2018/01/04 05:22:51
# isolating roach3
# isolated roach3
15	46	37	54	0	0	0	2018/01/04 05:22:52
16	0	0	0	0	0	0	2018/01/04 05:22:53
...
28	174	0	0	0	0	0	2018/01/04 05:23:05
29	168	0	0	0	0	0	2018/01/04 05:23:06
...
51	119	91	0	0	0	0	2018/01/04 05:23:28
52	116	92	0	0	0	0	2018/01/04 05:23:29
...
# rejoining roach3
# rejoined roach3
88	103	69	0	0	0	0	2018/01/04 05:24:05
89	116	79	0	0	0	0	2018/01/04 05:24:06
90	99	70	0	0	0	0	2018/01/04 05:24:07
91	26	17	0	0	0	0	2018/01/04 05:24:08
92	0	0	0	0	0	0	2018/01/04 05:24:09
93	0	0	0	0	0	0	2018/01/04 05:24:10
...
100	0	0	0	0	0	0	2018/01/04 05:24:17
101	3	13	1	0	0	1	2018/01/04 05:24:18
102	83	65	62	0	0	0	2018/01/04 05:24:19
103	80	61	60	0	0	0	2018/01/04 05:24:20</pre>

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