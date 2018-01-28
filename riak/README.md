Perseus/Riak is a set of scripts to investigate responsiveness of a Riak cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second. All operations are executed against consistent bucket to be on a par with other tested systems.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log` (2.2.3):

<pre>#legend: time|riak1|riak2|riak3|riak1:err|riak2:err|riak3:err
1	19	17	12	0	0	0	2018/01/28 09:36:43
2	26	26	21	0	0	0	2018/01/28 09:36:44
...
17	26	24	21	0	0	0	2018/01/28 09:36:59
18	28	25	23	0	0	0	2018/01/28 09:37:00
# isolating riak3
# isolated riak3
19	7	6	8	0	0	0	2018/01/28 09:37:01
20	0	0	0	1	1	1	2018/01/28 09:37:02
...
27	0	0	0	1	1	1	2018/01/28 09:37:09
28	0	39	0	1	1	1	2018/01/28 09:37:10
29	0	67	0	1	0	1	2018/01/28 09:37:11
...
147	0	25	0	106	0	106	2018/01/28 09:39:09
148	0	19	0	92	0	120	2018/01/28 09:39:10
# rejoining riak3
# rejoined riak3
149	11	20	5	40	0	73	2018/01/28 09:39:11
150	25	22	25	0	0	0	2018/01/28 09:39:12
...
158	21	23	21	0	0	0	2018/01/28 09:39:20
160	0	0	0	0	0	0	2018/01/28 09:39:22
161	20	27	0	1	1	93	2018/01/28 09:39:23
...
166	22	22	0	0	0	90	2018/01/28 09:39:28
167	27	24	16	0	0	1	2018/01/28 09:39:29
168	23	25	23	0	0	0	2018/01/28 09:39:30
</pre>

The first column is the number of second since the begining of the experiment, the following three columns represent the number of increments per each node of the cluster per second, the next triplet is number of errors per second and the last is time.

The all zero row means that all connections hang.

## How to use Perseus?

Clone this repository:

    git clone https://github.com/rystsov/perseus.git

Switch to riak folder:

    cd perseus/riak

Run the riak cluster (3 nodes):

    docker-compose up

Open new tab and nake the nodes aware about each other:

    ./form-cluster.sh

Then create a type for a consistent bucket:

    create-linearizable3.sh

Finally, build and run a client's container

    ./build-client.sh && ./run-client1.sh

You'll see an output similar to `logs/client1.log` but without isolating/rejoin markers (the log still has them).

Then use the `./isolate.sh riak3` to isolate `riak3` (you can use `riak1`, `riak2` too). To rejoin `riak3` to the cluster use  `./rejoin.sh riak3`