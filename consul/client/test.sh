#!/bin/bash

nodejs app/src/test.js $@ 2>&1 | tee -a /consul/logs/client1.log
