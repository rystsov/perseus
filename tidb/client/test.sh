#!/bin/bash

tidb1=$(getent hosts tidb1 | awk '{ print $1 }')
dbPort=4000

mysql -h $tidb1 -P $dbPort -u root < /tidb/schema.sql

date | tee /tidb/logs/client1.log
node-nightly --harmony app/src/test.js $@ 2>&1 | tee -a /tidb/logs/client1.log
