#!/bin/bash

host=$(cat etc/tidb-cluster.json | jq -r ".$1.host")
port=$(cat etc/tidb-cluster.json | jq -r ".$1.kv.port")
name=$(cat etc/tidb-cluster.json | jq -r ".$1.kv.name")
pd=$(cat etc/tidb-cluster.json | jq -r 'to_entries | map ("\(.value.host):\(.value.pd.clientPort)") | join(",")')

./tidb-latest-linux-amd64/bin/tikv-server \
    --pd=$pd \
    --log-file=$1.kv.log \
    --log-level=warn \
    --addr="$host:$port" \
    --store=$name
