#!/bin/bash

roach1=$(getent hosts roach1 | awk '{ print $1 }')

if [ -z "$roach1" ] ; then exit 1 ; fi;

/roach/cockroach-latest.linux-amd64/cockroach sql --insecure --host $roach1 -p 26257 < /roach/schema.sql

nodejs --harmony app/src/test.js $@ 2>&1 | tee -a /roach/logs/client1.log
