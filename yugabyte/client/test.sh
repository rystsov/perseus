#!/bin/bash

nodejs app/src/test.js $@ 2>&1 | tee -a /yuga/logs/client1.log
