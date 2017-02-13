#!/bin/bash

cluster=$(cat etc/etcd-cluster.json | jq -r 'to_entries | map ("\(.key)=http://\(.value.host):\(.value.peerPort)") | join(",")')
peer=$(cat etc/etcd-cluster.json | jq -r "\"http://\(.$1.host):\(.$1.peerPort)\"")
client=$(cat etc/etcd-cluster.json | jq -r "\"http://\(.$1.host):\(.$1.clientPort)\"")

mkdir -p deployment

./etcd-v3.1.0/etcd \
  --data-dir "deployment/$1.etcd" \
  --name $1 \
  --initial-advertise-peer-urls $peer \
  --listen-peer-urls $peer \
  --listen-client-urls $client \
  --advertise-client-urls $client \
  --initial-cluster-token etcd-cluster-1 \
  --initial-cluster "$cluster" \
  --initial-cluster-state new
