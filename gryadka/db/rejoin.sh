#!/bin/bash

gryadka1=$(getent hosts gryadka1 | awk '{ print $1 }')
gryadka2=$(getent hosts gryadka2 | awk '{ print $1 }')
gryadka3=$(getent hosts gryadka3 | awk '{ print $1 }')

myip=$(getent hosts $(hostname) | awk '{ print $1 }')

python -c "for ip in (set(['$gryadka1', '$gryadka2', '$gryadka3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -D INPUT -s '{}' -j DROP
python -c "for ip in (set(['$gryadka1', '$gryadka2', '$gryadka3']) - set(['$myip'])): print ip" | xargs -I '{}' iptables -D OUTPUT -d '{}' -j DROP
