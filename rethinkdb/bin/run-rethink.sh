#!/bin/bash

main=$(cat etc/rethink-cluster.json | jq -r "to_entries[] | select(.value.main) | .key")
ismain=$(cat etc/rethink-cluster.json  | jq -r ".$1.main")

host=$(cat etc/rethink-cluster.json | jq -r ".$1.host")
clusterPort=$(cat etc/rethink-cluster.json | jq -r ".$1.clusterPort")
driverPort=$(cat etc/rethink-cluster.json | jq -r ".$1.driverPort")
httpPort=$(cat etc/rethink-cluster.json | jq -r ".$1.httpPort")

mainPort=$(cat etc/rethink-cluster.json | jq -r ".$main.clusterPort")
mainHost=$(cat etc/rethink-cluster.json | jq -r ".$main.host")

mkdir -p deployment

if [[ "$ismain" = "true" ]]
then rethinkdb --directory deployment/$1 --bind $host --cluster-port $clusterPort --driver-port $driverPort --http-port $httpPort
else rethinkdb --directory deployment/$1 --bind $host --cluster-port $clusterPort --driver-port $driverPort --http-port $httpPort --join $mainHost:$mainPort
fi
