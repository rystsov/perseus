#!/bin/bash

docker rm client1
docker run -i -t --name=client1 --hostname=client1 --network=yugabyte_perseus -v $(pwd)/logs:/yuga/logs yuga_client