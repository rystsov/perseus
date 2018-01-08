Perseus/TiDB is a set of scripts to investigate responsiveness of a TiDB cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log`:

<pre>#legend: time|tidb1|tidb2|tidb3|tidb1:err|tidb2:err|tidb3:err
1	0	0	0	0	0	0	2018/01/08 07:35:04
2	14	36	22	0	0	0	2018/01/08 07:35:05
3	25	51	38	0	0	0	2018/01/08 07:35:06
...
161	39	37	39	0	0	0	2018/01/08 07:37:45
162	40	37	42	0	0	0	2018/01/08 07:37:46
# isolating tidb2
163	36	33	37	0	0	0	2018/01/08 07:37:47
# isolated tidb2
164	15	13	13	0	0	0	2018/01/08 07:37:48
165	0	0	0	0	0	0	2018/01/08 07:37:49
166	0	0	0	0	0	0	2018/01/08 07:37:50
...
183	0	0	0	0	0	0	2018/01/08 07:38:07
184	0	0	2	0	0	0	2018/01/08 07:38:08
185	0	0	86	0	0	0	2018/01/08 07:38:09
...
222	0	0	89	0	0	0	2018/01/08 07:38:46
223	0	0	92	0	0	0	2018/01/08 07:38:47
224	23	0	73	0	0	0	2018/01/08 07:38:48
225	44	0	68	0	0	0	2018/01/08 07:38:49
...
260	47	0	72	0	0	0	2018/01/08 07:39:24
261	49	0	71	0	0	0	2018/01/08 07:39:25
# rejoining tidb2
262	44	0	56	0	0	0	2018/01/08 07:39:26
# rejoined tidb2
263	46	0	52	0	0	0	2018/01/08 07:39:27
264	37	0	49	0	0	0	2018/01/08 07:39:28
...
271	50	0	57	0	0	0	2018/01/08 07:39:35
272	29	0	31	0	0	0	2018/01/08 07:39:36
273	0	0	0	0	0	0	2018/01/08 07:39:37
...
277	0	0	0	0	0	0	2018/01/08 07:39:41
278	48	0	0	0	0	0	2018/01/08 07:39:42
279	0	0	0	0	0	0	2018/01/08 07:39:43
...
288	0	0	0	0	0	0	2018/01/08 07:39:52
289	9	0	46	0	0	0	2018/01/08 07:39:53
290	45	0	50	0	0	0	2018/01/08 07:39:54
...
298	48	0	53	0	0	0	2018/01/08 07:40:02
299	43	0	25	0	0	0	2018/01/08 07:40:03
300	0	0	0	0	0	0	2018/01/08 07:40:04
...
321	0	0	0	0	0	0	2018/01/08 07:40:25
322	0	0	0	0	0	0	2018/01/08 07:40:26
323	26	0	46	0	1	0	2018/01/08 07:40:27
324	34	35	37	0	0	0	2018/01/08 07:40:28
325	33	40	41	0	0	0	2018/01/08 07:40:29</pre>

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