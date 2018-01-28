#!/bin/bash

docker exec riak1 riak-admin bucket-type create linearizable3 '{"props":{"consistent":true, "n_val":3}}'
docker exec riak1 riak-admin bucket-type activate linearizable3