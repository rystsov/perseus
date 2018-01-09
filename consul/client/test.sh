#!/bin/bash

node-nightly --harmony app/src/test.js $@ 2>&1 | tee -a /etcd/logs/client1.log
