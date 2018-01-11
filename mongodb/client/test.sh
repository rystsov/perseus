#!/bin/bash

date | tee /mongo/logs/client1.log
node-nightly --harmony app/src/test.js $@ 2>&1 | tee -a /mongo/logs/client1.log
