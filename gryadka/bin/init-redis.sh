#!/bin/bash

set -e

mkdir -p deployment/$1
node src/deploy/redis-conf.js $1 $(pwd)/deployment/$1

port=$(cat etc/gryadka-cluster.json | jq -r ".acceptors.$1.storage.port")
host=$(cat etc/gryadka-cluster.json | jq -r ".acceptors.$1.storage.host")

redis-server deployment/$1/redis.conf &
PID=$!
# I don't have an excuse for sleep
sleep 1
redis-cli -h $host -p $port SCRIPT LOAD "$(cat node_modules/gryadka/src/lua/accept.lua)" > deployment/$1/accept.hash
redis-cli -h $host -p $port SCRIPT LOAD "$(cat node_modules/gryadka/src/lua/prepare.lua)" > deployment/$1/prepare.hash
kill $PID
