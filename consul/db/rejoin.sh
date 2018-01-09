#!/bin/bash

consul1=$(getent hosts consul1 | awk '{ print $1 }')
consul2=$(getent hosts consul2 | awk '{ print $1 }')
consul3=$(getent hosts consul3 | awk '{ print $1 }')

myip=$(getent hosts $(hostname) | awk '{ print $1 }')

python -c "for ip in (set(['$consul1', '$consul2', '$consul3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -D INPUT -s '{}' -j DROP
python -c "for ip in (set(['$consul1', '$consul2', '$consul3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -D OUTPUT -d '{}' -j DROP
