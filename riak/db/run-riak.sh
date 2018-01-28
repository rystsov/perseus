#!/bin/bash

set -e

me=$(hostname)

riak1=$(getent hosts riak1 | awk '{ print $1 }')
riak2=$(getent hosts riak2 | awk '{ print $1 }')
riak3=$(getent hosts riak3 | awk '{ print $1 }')
myip=$(getent hosts $me | awk '{ print $1 }')

if [ -z "$riak1" ] ; then exit 1 ; fi;
if [ -z "$riak2" ] ; then exit 1 ; fi;
if [ -z "$riak3" ] ; then exit 1 ; fi;

mkdir -p /riak/logs/$me

chmod a+w /riak/mem

sed -i "s|listener.http.internal = 127.0.0.1:8098|listener.http.internal = 0.0.0.0:8098|" /etc/riak/riak.conf
sed -i "s|listener.protobuf.internal = 127.0.0.1:8087|listener.protobuf.internal = 0.0.0.0:8087|" /etc/riak/riak.conf
sed -i "s|nodename = riak@127.0.0.1|nodename = riak@$myip|" /etc/riak/riak.conf
sed -i "s|platform_log_dir = /var/log/riak|platform_log_dir = /riak/logs/$me|" /etc/riak/riak.conf
sed -i "s|platform_data_dir = /var/lib/riak|platform_data_dir = /riak/mem|" /etc/riak/riak.conf
sed -i "s|## strong_consistency = on|strong_consistency = on|" /etc/riak/riak.conf

riak console