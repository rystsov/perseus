Perseus/YugaByte is a set of scripts to investigate responsiveness of a YugaByte cluster when its node is separated from the peers.

The scripts measure an impact from a client's perspective by opening a connection to every node of the cluster, incrementing a value per each of them and dumping the statistics every second.

All scripts are dockerized so it's painless to reproduce the results.

## Output

A summary of `logs/client1.log` (v0.9.1.0):

<pre>#legend: time|yuga1|yuga2|yuga3|yuga1:err|yuga2:err|yuga3:err
1	70	68	118	0	0	0	2018/01/24 04:27:40
2	82	85	141	0	0	0	2018/01/24 04:27:41
...
12	82	68	153	0	0	0	2018/01/24 04:27:51
13	93	81	159	0	0	0	2018/01/24 04:27:52
# isolating yuga3
# isolated yuga3
14	78	78	124	0	0	0	2018/01/24 04:27:53
15	0	0	0	0	0	0	2018/01/24 04:27:54
...
380	0	0	0	0	0	0	2018/01/24 04:34:00
381	0	0	0	0	0	0	2018/01/24 04:34:01
# rejoining yuga3
# rejoined yuga3
382	0	0	0	0	0	0	2018/01/24 04:34:02
383	0	0	0	0	0	0	2018/01/24 04:34:03
...
432	0	0	0	0	0	0	2018/01/24 04:34:52
433	0	0	0	0	0	0	2018/01/24 04:34:53
434	118	111	77	1	1	1	2018/01/24 04:34:54
435	219	166	80	0	0	0	2018/01/24 04:34:55</pre>

The first column is the number of second since the begining of the experiment, the following three columns represent the number of increments per each node of the cluster per second, the next triplet is number of errors per second and the last is time.

The all zero row means that all connections hang.

## How to use Perseus?

Clone this repository:

    git clone https://github.com/rystsov/perseus.git

Switch to yugabyte folder:

    cd perseus/yugabyte

Run the yugabyte cluster (3 nodes):

    docker-compose up

Open new tab and activate Redis interface

    ./enable-redis.sh

Open new tab, build and run a client's container

    ./build-client.sh && ./run-client1.sh

You'll see an output similar to `logs/client1.log` but without isolating/rejoin markers (the log still has them).

Then use the `./isolate.sh yuga3` to isolate `yuga3` (you can use `yuga1`, `yuga2` too). To rejoin `yuga3` to the cluster use  `./rejoin.sh yuga3`