#!/bin/bash

me=$(hostname)

if [[ "$me" = "consul1" ]]
then
/consul/consul agent -server -client=0.0.0.0 -data-dir=/consul/mem -bootstrap-expect=3  > /consul/logs/$me.log
else
/consul/consul agent -server -client=0.0.0.0 -data-dir=/consul/mem -bootstrap-expect=3 -join consul1 > /consul/logs/$me.log
fi
