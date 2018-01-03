#!/bin/bash

me=$(hostname)

tidb1=$(getent hosts tidb1 | awk '{ print $1 }')
tidb2=$(getent hosts tidb2 | awk '{ print $1 }')
tidb3=$(getent hosts tidb3 | awk '{ print $1 }')

if [ -z "$tidb1" ] ; then exit 1 ; fi;
if [ -z "$tidb2" ] ; then exit 1 ; fi;
if [ -z "$tidb3" ] ; then exit 1 ; fi;

myip=$(getent hosts $me | awk '{ print $1 }')

pdPort=2379
kvPort=20160
pd="$tidb1:$pdPort,$tidb2:$pdPort,$tidb3:$pdPort"

trap 'kill -TERM $PID' TERM INT
/tidb/tidb-latest-linux-amd64/bin/tikv-server \
    --pd=$pd \
    --log-file=/tidb/logs/$me.kv.log \
    --log-level=warn \
    --addr="$myip:$kvPort" \
    --store="/tidb/mem/$me.kv" &
PID=$!
wait $PID
trap - TERM INT
wait $PID
EXIT_STATUS=$?