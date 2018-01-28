#!/bin/bash

set -e

riak1=$(getent hosts riak1 | awk '{ print $1 }')

if [ -z "$riak1" ] ; then exit 1 ; fi;

riak-admin cluster join riak@$riak1
riak-admin cluster plan
riak-admin cluster commit
