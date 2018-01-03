Perseus/Etcd is a set of scripts to investigate responsiveness of a Etcd cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log`:

<pre>#legend: time|etcd1|etcd2|etcd3|etcd1:err|etcd2:err|etcd3:err
1	43	49	43	0	0	0	2018/01/03 04:34:40
2	43	49	43	0	0	0	2018/01/03 04:34:41
...
28	56	58	59	0	0	0	2018/01/03 04:35:07
29	55	57	54	0	0	0	2018/01/03 04:35:08
# isolating etcd1
# isolated etcd1
30	9	70	66	0	0	0	2018/01/03 04:35:09
31	0	72	64	1	0	0	2018/01/03 04:35:10
...
50	0	91	80	1	0	0	2018/01/03 04:35:29
51	0	91	75	1	0	0	2018/01/03 04:35:30
# rejoining etcd1
# rejoined etcd1
52	0	58	52	1	0	0	2018/01/03 04:35:31
53	0	0	0	1	1	1	2018/01/03 04:35:32
54	42	49	44	1	0	0	2018/01/03 04:35:33
55	53	62	50	0	0	0	2018/01/03 04:35:34</pre>

The first column is the number of second since the begining of the experiment, the following last three columns represent the number of increments per each node of the cluster per second, the next triplet is number of errors per second and the last is time.

The all zero row means that all connections hang.

## How to use Perseus?

Clone this repository:

    git clone https://github.com/rystsov/perseus.git

Switch to Etcd folder:

    cd perseus/etcd

Run the etcd cluster (3 nodes):

    docker-compose up

Open new tab, build and run a client's container

    ./build-client.sh && ./run-client1.sh

You'll see an output similar to `logs/client1.log` but without isolating/rejoin markers (the log still has them).

Then use the `./isolate.sh etcd1` to isolate `etcd1` (you can use `etcd2`, `etcd3` too). To rejoin `etcd1` to the cluster use  `./rejoin.sh etcd1`