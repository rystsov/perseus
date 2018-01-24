#!/bin/bash

me=$(hostname)

yuga1=$(getent hosts yuga1 | awk '{ print $1 }')
yuga2=$(getent hosts yuga2 | awk '{ print $1 }')
yuga3=$(getent hosts yuga3 | awk '{ print $1 }')

if [ -z "$yuga1" ] ; then exit 1 ; fi;
if [ -z "$yuga2" ] ; then exit 1 ; fi;
if [ -z "$yuga3" ] ; then exit 1 ; fi;

mkdir -p /yuga/logs/$me/master

echo "yuga1: $yuga1" >> /yuga/logs/$me/ip.log
echo "yuga2: $yuga2" >> /yuga/logs/$me/ip.log
echo "yuga3: $yuga3" >> /yuga/logs/$me/ip.log

/yuga/yugabyte-0.9.1.0/bin/yb-master --master_addresses $yuga1:7100,$yuga2:7100,$yuga3:7100 --fs_data_dirs "/yuga/mem/yb-master" --log_dir "/yuga/logs/$me/master"
