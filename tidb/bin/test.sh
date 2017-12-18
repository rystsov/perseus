#!/bin/bash

node-nightly --harmony src/test.js $@ 2>&1 | tee client.log
