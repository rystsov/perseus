#!/bin/bash

# see https://github.com/coreos/etcd/releases/

ETCD_VER=v3.1.0
DOWNLOAD_URL=https://github.com/coreos/etcd/releases/download
curl -L ${DOWNLOAD_URL}/${ETCD_VER}/etcd-${ETCD_VER}-darwin-amd64.zip -o /tmp/etcd-${ETCD_VER}-darwin-amd64.zip
unzip /tmp/etcd-${ETCD_VER}-darwin-amd64.zip -d $(pwd)
mv etcd-${ETCD_VER}-darwin-amd64 etcd-v3.1.0
