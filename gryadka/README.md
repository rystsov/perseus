Perseus/Gryadka is a set of scripts to investigate responsiveness of a Gryadka cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log`:

<pre>#legend: time|gryadka1|gryadka2|gryadka3|gryadka1:err|gryadka2:err|gryadka3:err
1	51	58	60	0	0	0	2018/01/07 09:38:08
2	70	54	57	0	0	0	2018/01/07 09:38:09
...
25	78	70	66	0	0	0	2018/01/07 09:38:32
26	71	64	76	0	0	0	2018/01/07 09:38:33
# isolating gryadka2
# isolated gryadka2
27	69	60	68	0	0	0	2018/01/07 09:38:34
28	84	0	95	0	11	0	2018/01/07 09:38:35
...
47	66	0	78	0	144	0	2018/01/07 09:38:54
48	71	0	75	0	139	0	2018/01/07 09:38:55
# rejoining gryadka2
# rejoined gryadka2
49	66	0	62	0	133	0	2018/01/07 09:38:56
...
56	61	0	54	0	104	0	2018/01/07 09:39:03
57	59	45	76	0	57	0	2018/01/07 09:39:04</pre>

The first column is the number of second since the begining of the experiment, the following last three columns represent the number of increments per each node of the cluster per second, the next triplet is number of errors per second and the last is time.

The all zero row means that all connections hang.

## How to use Perseus?

Clone this repository:

    git clone https://github.com/rystsov/perseus.git

Switch to gryadka folder:

    cd perseus/gryadka

Run the gryadka cluster (3 nodes):

    docker-compose up

Open new tab, build and run a client's container

    ./build-client.sh && ./run-client1.sh

You'll see an output similar to `logs/client1.log` but without isolating/rejoin markers (the log still has them).

Then use the `./isolate.sh gryadka1` to isolate `gryadka1` (you can use `gryadka2`, `gryadka3` too). To rejoin `gryadka1` to the cluster use  `./rejoin.sh gryadka1`