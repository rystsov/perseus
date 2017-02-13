#!/bin/bash

set -e

mkdir -p deployment

node-nightly --harmony src/deploy/proposer.js "etc/gryadka-cluster.json" $1 "$(pwd)/deployment"
