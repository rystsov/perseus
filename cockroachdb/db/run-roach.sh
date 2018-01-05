#!/bin/bash

me=$(hostname)

roach1=$(getent hosts roach1 | awk '{ print $1 }')
roach2=$(getent hosts roach2 | awk '{ print $1 }')
roach3=$(getent hosts roach3 | awk '{ print $1 }')

if [ -z "$roach1" ] ; then exit 1 ; fi;
if [ -z "$roach2" ] ; then exit 1 ; fi;
if [ -z "$roach3" ] ; then exit 1 ; fi;

myip=$(getent hosts $me | awk '{ print $1 }')

join=""

if [ "$me" != "roach1" ]; then
join="$roach1:26257"
fi

/roach/cockroach-latest.linux-amd64/cockroach start --port=26257 --log-dir=/roach/logs/$me --http-port=8080 --insecure --host=$myip --store=/roach/mem --join=$join
