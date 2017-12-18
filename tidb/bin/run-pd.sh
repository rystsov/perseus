#!/bin/bash

clientPort=$(cat etc/tidb-cluster.json | jq -r ".$1.pd.clientPort")
peerPort=$(cat etc/tidb-cluster.json | jq -r ".$1.pd.peerPort")
host=$(cat etc/tidb-cluster.json | jq -r ".$1.host")
name=$(cat etc/tidb-cluster.json | jq -r ".$1.pd.name")
peers=$(cat etc/tidb-cluster.json | jq -r 'to_entries | map ("\(.value.pd.name)=http://\(.value.host):\(.value.pd.peerPort)") | join(",")')

./tidb-latest-linux-amd64/bin/pd-server \
    --name=$name \
    --data-dir=$name \
    --log-file=$1.pd.log \
    --client-urls="http://$host:$clientPort" \
    --peer-urls="http://$host:$peerPort" \
    --initial-cluster=$peers
