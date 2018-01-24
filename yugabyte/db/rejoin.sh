#!/bin/bash

set -e

yuga1=$(getent hosts yuga1 | awk '{ print $1 }')
yuga2=$(getent hosts yuga2 | awk '{ print $1 }')
yuga3=$(getent hosts yuga3 | awk '{ print $1 }')

myip=$(getent hosts $(hostname) | awk '{ print $1 }')

if [ -z "$yuga1" ] ; then exit 1 ; fi;
if [ -z "$yuga2" ] ; then exit 1 ; fi;
if [ -z "$yuga3" ] ; then exit 1 ; fi;

python -c "for ip in (set(['$yuga1', '$yuga2', '$yuga3']) - set(['$myip'])): print ip" | xargs -I '{}' echo "Rejoining: {}"

python -c "for ip in (set(['$yuga1', '$yuga2', '$yuga3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -D INPUT -s '{}' -j DROP
python -c "for ip in (set(['$yuga1', '$yuga2', '$yuga3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -D OUTPUT -d '{}' -j DROP

echo "Rejoined"