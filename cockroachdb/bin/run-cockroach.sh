#!/bin/bash

PATH=$PATH:$(pwd)/cockroach-latest.linux-amd64

pgPort=$(cat etc/roach-cluster.json | jq -r ".$1.pgPort")
adminPort=$(cat etc/roach-cluster.json | jq -r ".$1.adminPort")
host=$(cat etc/roach-cluster.json | jq -r ".$1.host")
join=$(cat etc/roach-cluster.json | jq -r "to_entries[] | select(.key!=\"$1\") | select(.value.main==true) | \"\(.value.host):\(.value.pgPort)\"")

cockroach start --port=$pgPort --http-port=$adminPort --insecure --host=$host --store=$1 --join=$join
