#!/bin/bash

yuga1=$(getent hosts yuga1 | awk '{ print $1 }')
yuga2=$(getent hosts yuga2 | awk '{ print $1 }')
yuga3=$(getent hosts yuga3 | awk '{ print $1 }')

if [ -z "$yuga1" ] ; then exit 1 ; fi;
if [ -z "$yuga2" ] ; then exit 1 ; fi;
if [ -z "$yuga3" ] ; then exit 1 ; fi;

/yuga/yugabyte-0.9.1.0/bin/yb-admin --master_addresses $yuga1:7100,$yuga2:7100,$yuga3:7100 setup_redis_table

echo "Done"