#!/bin/bash

host=$(cat etc/tidb-cluster.json | jq -r ".$1.host")
port=$(cat etc/tidb-cluster.json | jq -r ".$1.db.port")
statusPort=$(cat etc/tidb-cluster.json | jq -r ".$1.db.statusPort")
pd=$(cat etc/tidb-cluster.json | jq -r 'to_entries | map ("\(.value.host):\(.value.pd.clientPort)") | join(",")')

./tidb-latest-linux-amd64/bin/tidb-server \
    -log-file=$1.db.log \
    --status=$statusPort \
    --host=$host \
    --P=$port \
    --store=tikv \
    --path=$pd
