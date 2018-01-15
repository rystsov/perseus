Perseus/TiDB is a set of scripts to investigate responsiveness of a TiDB cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log` (PD: v1.1.0-alpha-54-g5598c00, TiKV: 1.0.1, TiDB: v1.1.0-alpha-357-gb1e1a26):

<pre>#legend: time|tidb1|tidb2|tidb3|tidb1:err|tidb2:err|tidb3:err
8	40	20	39	0	0	0	2018/01/14 11:53:22
9	31	27	39	0	0	0	2018/01/14 11:53:23
...
166	36	38	31	0	0	0	2018/01/14 11:56:00
167	39	39	31	0	0	0	2018/01/14 11:56:01
# isolating tidb1
168	26	26	24	0	0	0	2018/01/14 11:56:02
# isolated tidb1
169	4	6	5	0	0	0	2018/01/14 11:56:03
170	0	0	0	0	0	0	2018/01/14 11:56:04
...
183	0	0	0	0	0	0	2018/01/14 11:56:17
184	0	0	0	0	0	0	2018/01/14 11:56:18
185	0	33	0	0	0	0	2018/01/14 11:56:19
186	0	57	35	0	0	0	2018/01/14 11:56:20
187	0	59	43	0	0	0	2018/01/14 11:56:21
...
229	0	55	46	1	0	0	2018/01/14 11:57:03
230	0	54	45	0	0	0	2018/01/14 11:57:04
# rejoining tidb1
# rejoined tidb1
231	0	42	38	0	0	0	2018/01/14 11:57:05
232	0	30	29	0	0	0	2018/01/14 11:57:06
...
237	0	56	46	0	0	0	2018/01/14 11:57:11
238	0	30	23	0	0	0	2018/01/14 11:57:12
239	0	0	0	0	0	0	2018/01/14 11:57:13
...
243	0	0	0	0	0	0	2018/01/14 11:57:17
244	0	0	25	0	0	0	2018/01/14 11:57:18
245	0	6	42	0	1	0	2018/01/14 11:57:19
246	2	54	41	1	0	0	2018/01/14 11:57:20
247	0	49	43	0	0	0	2018/01/14 11:57:21
...
259	0	52	47	0	0	0	2018/01/14 11:57:33
260	0	34	28	0	25	50	2018/01/14 11:57:34
261	0	0	0	0	67	119	2018/01/14 11:57:35
262	0	0	0	0	63	106	2018/01/14 11:57:36
...
280	0	0	0	0	69	128	2018/01/14 11:57:54
281	0	0	0	0	65	119	2018/01/14 11:57:55
282	65	0	0	0	0	0	2018/01/14 11:57:56
...
286	77	0	0	0	0	0	2018/01/14 11:58:00
287	3	0	0	0	0	0	2018/01/14 11:58:01
288	0	0	0	0	0	0	2018/01/14 11:58:02
...
343	0	0	0	0	0	0	2018/01/14 11:58:58
344	1	0	0	0	0	0	2018/01/14 11:58:59
345	33	26	33	0	0	0	2018/01/14 11:59:00
346	24	17	25	0	0	0	2018/01/14 11:59:01</pre>

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