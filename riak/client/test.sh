#!/bin/bash

nodejs app/src/test.js $@ 2>&1 | tee -a /riak/logs/client1.log
