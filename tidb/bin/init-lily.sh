#!/bin/bash

host=$(cat etc/tidb-cluster.json | jq -r ".$1.host")
port=$(cat etc/tidb-cluster.json | jq -r ".$1.db.port")

mysql -h $host -P $port -u root < etc/schema.sql
