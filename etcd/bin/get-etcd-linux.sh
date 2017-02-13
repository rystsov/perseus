#!/bin/bash

# see https://github.com/coreos/etcd/releases/

ETCD_VER=v3.1.0
DOWNLOAD_URL=https://github.com/coreos/etcd/releases/download
curl -L ${DOWNLOAD_URL}/${ETCD_VER}/etcd-${ETCD_VER}-linux-amd64.tar.gz -o /tmp/etcd-${ETCD_VER}-linux-amd64.tar.gz
mkdir -p etcd-v3.1.0 && tar xzvf /tmp/etcd-${ETCD_VER}-linux-amd64.tar.gz -C etcd-v3.1.0 --strip-components=1
