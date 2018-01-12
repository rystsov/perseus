#!/bin/bash

set -e

tidb1=$(getent hosts tidb1 | awk '{ print $1 }')
tidb2=$(getent hosts tidb2 | awk '{ print $1 }')
tidb3=$(getent hosts tidb3 | awk '{ print $1 }')

myip=$(getent hosts $(hostname) | awk '{ print $1 }')

if [ -z "$tidb1" ] ; then exit 1 ; fi;
if [ -z "$tidb2" ] ; then exit 1 ; fi;
if [ -z "$tidb3" ] ; then exit 1 ; fi;

python -c "for ip in (set(['$tidb1', '$tidb2', '$tidb3']) - set(['$myip'])): print ip" | xargs -I '{}' echo "Isolating: {}"

python -c "for ip in (set(['$tidb1', '$tidb2', '$tidb3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -A INPUT -s '{}' -j DROP
python -c "for ip in (set(['$tidb1', '$tidb2', '$tidb3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -A OUTPUT -d '{}' -j DROP

echo "Isolated"