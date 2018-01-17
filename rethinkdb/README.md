Perseus/RethinkDB is a set of scripts to investigate responsiveness of a RethinkDB cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log` (2.3.6~0zesty):

<pre>#legend: time|rethink1|rethink2|rethink3|rethink1:err|rethink2:err|rethink3:err
1	133	130	140	0	0	0	2018/01/08 04:53:07
2	139	141	145	0	0	0	2018/01/08 04:53:08
...
28	154	135	151	0	0	0	2018/01/08 04:53:34
29	164	155	191	0	0	0	2018/01/08 04:53:35
# isolating rethink3
30	142	138	162	0	0	0	2018/01/08 04:53:36
# isolated rethink3
31	7	10	11	0	0	0	2018/01/08 04:53:37
32	0	0	0	0	0	0	2018/01/08 04:53:38
...
44	0	0	0	0	0	0	2018/01/08 04:53:50
45	0	0	0	29	0	0	2018/01/08 04:53:51
46	0	0	0	567	44	41	2018/01/08 04:53:52
47	0	0	0	273	258	267	2018/01/08 04:53:53
48	0	0	0	249	278	266	2018/01/08 04:53:54
49	76	75	0	136	138	328	2018/01/08 04:53:55
50	166	180	0	0	0	370	2018/01/08 04:53:56
...
88	151	183	0	0	0	272	2018/01/08 04:54:34
89	160	162	0	0	0	334	2018/01/08 04:54:35
# rejoining rethink3
# rejoined rethink3
90	152	164	0	0	0	310	2018/01/08 04:54:36
91	142	151	0	0	0	245	2018/01/08 04:54:37
...
110	149	165	0	0	0	378	2018/01/08 04:54:56
111	119	140	26	48	46	252	2018/01/08 04:54:57
112	86	103	81	120	108	118	2018/01/08 04:54:58
113	148	172	154	0	0	0	2018/01/08 04:54:59
114	166	164	173	0	0	0	2018/01/08 04:55:00</pre>

The first column is the number of second since the begining of the experiment, the following three columns represent the number of increments per each node of the cluster per second, the next triplet is number of errors per second and the last is time.

The all zero row means that all connections hang.

## How to use Perseus?

Clone this repository:

    git clone https://github.com/rystsov/perseus.git

Switch to rethink folder:

    cd perseus/rethinkdb

Run the rethink cluster (3 nodes):

    docker-compose up

Open new tab, build and run a client's container

    ./build-client.sh && ./run-client1.sh

You'll see an output similar to `logs/client1.log` but without isolating/rejoin markers (the log still has them).

Then use the `./isolate.sh rethink1` to isolate `rethink1` (you can use `rethink2`, `rethink3` too). To rejoin `rethink1` to the cluster use  `./rejoin.sh rethink1`