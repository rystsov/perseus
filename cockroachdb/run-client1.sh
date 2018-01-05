#!/bin/bash

docker rm client1
docker run -i -t --name=client1 --hostname=client1 --network=cockroachdb_perseus -v $(pwd)/logs:/roach/logs roach_client