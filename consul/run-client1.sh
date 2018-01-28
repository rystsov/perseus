#!/bin/bash

docker rm client1
docker run -i -t --name=client1 --hostname=client1 --network=consul_perseus -v $(pwd)/logs:/consul/logs consul_client