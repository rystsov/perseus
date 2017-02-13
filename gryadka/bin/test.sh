#!/bin/bash

cluster=$(cat etc/gryadka-cluster.json | jq -r '.proposers | to_entries | map("\(.value.host):\(.value.port)") | join(",")')

node-nightly --harmony node_modules/perseus-etcd/src/test.js "$cluster"
