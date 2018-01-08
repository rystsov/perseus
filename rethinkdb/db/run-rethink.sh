#!/bin/bash

me=$(hostname)

rethink1=$(getent hosts rethink1 | awk '{ print $1 }')
rethink2=$(getent hosts rethink2 | awk '{ print $1 }')
rethink3=$(getent hosts rethink3 | awk '{ print $1 }')

if [ -z "$rethink1" ] ; then exit 1 ; fi;
if [ -z "$rethink2" ] ; then exit 1 ; fi;
if [ -z "$rethink3" ] ; then exit 1 ; fi;

if [[ "$me" = "rethink1" ]]
then
rethinkdb --directory /rethink/mem --bind all --cluster-port 29016 --driver-port 28016 --http-port 8086 > /rethink/logs/$me.log
else
rethinkdb --directory /rethink/mem --bind all --cluster-port 29016 --driver-port 28016 --http-port 8086 --join $rethink1:29016 > /rethink/logs/$me.log
fi
