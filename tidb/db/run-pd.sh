#!/bin/bash

me=$(hostname)

tidb1=$(getent hosts tidb1 | awk '{ print $1 }')
tidb2=$(getent hosts tidb2 | awk '{ print $1 }')
tidb3=$(getent hosts tidb3 | awk '{ print $1 }')

if [ -z "$tidb1" ] ; then exit 1 ; fi;
if [ -z "$tidb2" ] ; then exit 1 ; fi;
if [ -z "$tidb3" ] ; then exit 1 ; fi;

myip=$(getent hosts $me | awk '{ print $1 }')

clientPort=2379
peerPort=2380
cluster="tidb1=http://$tidb1:$peerPort,tidb2=http://$tidb2:$peerPort,tidb3=http://$tidb3:$peerPort"

trap 'kill -TERM $PID' TERM INT
/tidb/tidb-latest-linux-amd64/bin/pd-server \
    --name=$me \
    --log-file=/tidb/logs/$me.pd.log \
    --data-dir="/tidb/mem/$me.pd" \
    --client-urls="http://$myip:$clientPort" \
    --peer-urls="http://$myip:$peerPort" \
    --initial-cluster=$cluster &
PID=$!
wait $PID
trap - TERM INT
wait $PID
EXIT_STATUS=$?