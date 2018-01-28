#!/bin/bash

docker exec riak2 /riak/join-riak1.sh
docker exec riak3 /riak/join-riak1.sh