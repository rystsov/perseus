#!/bin/bash

set -e

roach1=$(getent hosts roach1 | awk '{ print $1 }')
roach2=$(getent hosts roach2 | awk '{ print $1 }')
roach3=$(getent hosts roach3 | awk '{ print $1 }')

myip=$(getent hosts $(hostname) | awk '{ print $1 }')

if [ -z "$roach1" ] ; then exit 1 ; fi;
if [ -z "$roach2" ] ; then exit 1 ; fi;
if [ -z "$roach3" ] ; then exit 1 ; fi;

python -c "for ip in (set(['$roach1', '$roach2', '$roach3']) - set(['$myip'])): print ip" | xargs -I '{}' echo "Rejoining: {}"

python -c "for ip in (set(['$roach1', '$roach2', '$roach3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -D INPUT -s '{}' -j DROP
python -c "for ip in (set(['$roach1', '$roach2', '$roach3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -D OUTPUT -d '{}' -j DROP

echo "Rejoined"