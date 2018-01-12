#!/bin/bash

set -e

consul1=$(getent hosts consul1 | awk '{ print $1 }')
consul2=$(getent hosts consul2 | awk '{ print $1 }')
consul3=$(getent hosts consul3 | awk '{ print $1 }')

myip=$(getent hosts $(hostname) | awk '{ print $1 }')

if [ -z "$consul1" ] ; then exit 1 ; fi;
if [ -z "$consul2" ] ; then exit 1 ; fi;
if [ -z "$consul3" ] ; then exit 1 ; fi;

python -c "for ip in (set(['$consul1', '$consul2', '$consul3']) - set(['$myip'])): print ip" | xargs -I '{}' echo "Isolating: {}"

python -c "for ip in (set(['$consul1', '$consul2', '$consul3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -A INPUT -s '{}' -j DROP
python -c "for ip in (set(['$consul1', '$consul2', '$consul3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -A OUTPUT -d '{}' -j DROP

echo "Isolated"