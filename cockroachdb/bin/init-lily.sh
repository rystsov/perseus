#!/bin/bash

PATH=$PATH:$(pwd)/cockroach-latest.linux-amd64

pgPort=$(cat etc/roach-cluster.json | jq -r ".$1.pgPort")
host=$(cat etc/roach-cluster.json | jq -r ".$1.host")

cockroach sql --insecure --host $host -p $pgPort < etc/schema.sql
