#!/bin/bash

set -e

riak1=$(getent hosts riak1 | awk '{ print $1 }')
riak2=$(getent hosts riak2 | awk '{ print $1 }')
riak3=$(getent hosts riak3 | awk '{ print $1 }')

myip=$(getent hosts $(hostname) | awk '{ print $1 }')

if [ -z "$riak1" ] ; then exit 1 ; fi;
if [ -z "$riak2" ] ; then exit 1 ; fi;
if [ -z "$riak3" ] ; then exit 1 ; fi;

python -c "for ip in (set(['$riak1', '$riak2', '$riak3']) - set(['$myip'])): print ip" | xargs -I '{}' echo "Isolating: {}"

python -c "for ip in (set(['$riak1', '$riak2', '$riak3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -A INPUT -s '{}' -j DROP
python -c "for ip in (set(['$riak1', '$riak2', '$riak3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -A OUTPUT -d '{}' -j DROP

echo "Isolated"