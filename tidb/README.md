Perseus/TiDB is a set of scripts to investigate responsiveness of a TiDB cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log`:

<pre>#legend: time|tidb1|tidb2|tidb3|tidb1:err|tidb2:err|tidb3:err
1	14	19	14	0	0	0	2018/01/03 04:17:25
2	27	47	32	0	0	0	2018/01/03 04:17:26
...
43	40	41	36	0	0	0	2018/01/03 04:18:07
44	38	38	34	0	0	0	2018/01/03 04:18:08
# isolating tidb3
# isolated tidb3
45	9	8	7	0	0	0	2018/01/03 04:18:09
46	0	0	0	0	0	0	2018/01/03 04:18:10
...
# rejoining tidb3
# rejoined tidb3
83	0	0	0	0	0	0	2018/01/03 04:18:47
84	0	0	0	0	0	0	2018/01/03 04:18:48
...
109	0	0	0	0	0	0	2018/01/03 04:19:13
110	18	14	17	0	0	0	2018/01/03 04:19:14
111	38	33	39	0	0	0	2018/01/03 04:19:15</pre>

The first column is the number of second since the begining of the experiment, the following last three columns represent the number of increments per each node of the cluster per second, the next triplet is number of errors per second and the last is time.

The all zero row means that all connections hang.

## How to use Perseus?

Clone this repository:

    git clone https://github.com/rystsov/perseus.git

Switch to TiDB folder:

    cd perseus/tidb

Run the tidb cluster (3 nodes):

    docker-compose up

Open new tab, build and run a client's container

    ./build-client.sh && ./run-client1.sh

You'll see an output similar to `logs/client1.log` but without isolating/rejoin markers (the log still has them).

Then use the `./isolate.sh tidb1` to isolate `tidb1` (you can use `tidb2`, `tidb3` too). To rejoin `tidb1` to the cluster use  `./rejoin.sh tidb1`

As a result of the expirements a [bug](https://github.com/pingcap/tidb/issues/2676) was fired.