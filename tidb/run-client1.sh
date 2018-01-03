#!/bin/bash

docker rm client1
docker run -i -t --name=client1 --hostname=client1 --network=tidb_perseus -v $(pwd)/logs:/tidb/logs tidb_client