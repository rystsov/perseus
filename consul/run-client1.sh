#!/bin/bash

docker rm client1
docker run -i -t --name=client1 --hostname=client1 --network=consul_perseus -v $(pwd)/logs:/etcd/logs consul_client