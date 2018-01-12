#!/bin/bash

set -e

rethink1=$(getent hosts rethink1 | awk '{ print $1 }')
rethink2=$(getent hosts rethink2 | awk '{ print $1 }')
rethink3=$(getent hosts rethink3 | awk '{ print $1 }')

myip=$(getent hosts $(hostname) | awk '{ print $1 }')

if [ -z "$rethink1" ] ; then exit 1 ; fi;
if [ -z "$rethink2" ] ; then exit 1 ; fi;
if [ -z "$rethink3" ] ; then exit 1 ; fi;

python -c "for ip in (set(['$rethink1', '$rethink2', '$rethink3']) - set(['$myip'])): print ip" | xargs -I '{}' echo "Rejoining: {}"

python -c "for ip in (set(['$rethink1', '$rethink2', '$rethink3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -D INPUT -s '{}' -j DROP
python -c "for ip in (set(['$rethink1', '$rethink2', '$rethink3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -D OUTPUT -d '{}' -j DROP

echo "Rejoined"