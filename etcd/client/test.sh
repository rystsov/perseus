#!/bin/bash

nodejs --harmony app/src/test.js $@ 2>&1 | tee -a /etcd/logs/client1.log
