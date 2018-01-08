#!/bin/bash

set -e

node-nightly --harmony app/src/init.js
node-nightly --harmony app/src/test.js $@ 2>&1 | tee -a /rethink/logs/client1.log