#!/bin/bash

set -e

nodejs --harmony app/src/init.js
nodejs --harmony app/src/test.js $@ 2>&1 | tee -a /rethink/logs/client1.log