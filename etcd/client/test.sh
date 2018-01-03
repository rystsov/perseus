#!/bin/bash

date | tee /etcd/logs/client1.log
node-nightly --harmony app/src/test.js $@ 2>&1 | tee -a /etcd/logs/client1.log
