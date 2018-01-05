#!/bin/bash

roach1=$(getent hosts roach1 | awk '{ print $1 }')
roach2=$(getent hosts roach2 | awk '{ print $1 }')
roach3=$(getent hosts roach3 | awk '{ print $1 }')

myip=$(getent hosts $(hostname) | awk '{ print $1 }')

python -c "for ip in (set(['$roach1', '$roach2', '$roach3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -A INPUT -s '{}' -j DROP
python -c "for ip in (set(['$roach1', '$roach2', '$roach3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -A OUTPUT -d '{}' -j DROP
