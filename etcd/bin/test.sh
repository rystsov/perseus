#!/bin/bash

cluster=$(cat etc/etcd-cluster.json | jq -r 'to_entries | map ("\(.value.host):\(.value.clientPort)") | join(",")')

node-nightly --harmony src/test.js "$cluster"
