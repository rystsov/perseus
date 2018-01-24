#!/bin/bash

set -e

nodejs app/src/init.js
nodejs app/src/test.js $@ 2>&1 | tee -a /rethink/logs/client1.log