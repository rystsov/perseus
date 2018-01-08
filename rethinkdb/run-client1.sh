#!/bin/bash

docker rm client1
docker run -i -t --name=client1 --hostname=client1 --network=rethinkdb_perseus -v $(pwd)/logs:/rethink/logs rethink_client