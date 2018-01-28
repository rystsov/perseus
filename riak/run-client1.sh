#!/bin/bash

docker rm client1
docker run -i -t --name=client1 --hostname=client1 --network=riak_perseus -v $(pwd)/logs:/riak/logs riak_client