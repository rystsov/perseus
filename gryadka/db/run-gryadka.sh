#!/bin/bash

set -e

redis-cli -h 127.0.0.1 -p 6379 SCRIPT LOAD "$(cat /gryadka/gryadka-etcd/node_modules/gryadka/src/lua/accept.lua)" > /gryadka/accept.hash
redis-cli -h 127.0.0.1 -p 6379 SCRIPT LOAD "$(cat /gryadka/gryadka-etcd/node_modules/gryadka/src/lua/prepare.lua)" > /gryadka/prepare.hash

me=$(hostname)

nodejs --harmony /gryadka/gryadka-etcd/src/etcd-like-api.js "/gryadka/cluster.json" $me > /gryadka/logs/$me.api.log
