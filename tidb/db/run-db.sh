#!/bin/bash

me=$(hostname)

tidb1=$(getent hosts tidb1 | awk '{ print $1 }')
tidb2=$(getent hosts tidb2 | awk '{ print $1 }')
tidb3=$(getent hosts tidb3 | awk '{ print $1 }')

if [ -z "$tidb1" ] ; then exit 1 ; fi;
if [ -z "$tidb2" ] ; then exit 1 ; fi;
if [ -z "$tidb3" ] ; then exit 1 ; fi;

myip=$(getent hosts $me | awk '{ print $1 }')

dbPort=4000
statusPort=10080
pdPort=2379

pd="$tidb1:$pdPort,$tidb2:$pdPort,$tidb3:$pdPort"

trap 'kill -TERM $PID' TERM INT
./tidb-latest-linux-amd64/bin/tidb-server \
    --status=$statusPort \
    --log-file=/tidb/logs/$me.db.log \
    --log-slow-query=/tidb/logs/$me.slow.log \
    --host=$myip \
    --P=$dbPort \
    --store=tikv \
    --path=$pd
PID=$!
wait $PID
trap - TERM INT
wait $PID
EXIT_STATUS=$?