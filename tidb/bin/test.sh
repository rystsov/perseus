#!/bin/bash

date | tee client.log
node-nightly --harmony src/test.js $@ 2>&1 | tee -a client.log
