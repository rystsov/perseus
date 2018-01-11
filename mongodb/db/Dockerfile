FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y wget supervisor iptables
RUN apt-get install -y iputils-ping vim tmux less
RUN apt-get install -y nodejs npm
RUN npm install --global node-nightly
RUN node-nightly
RUN mkdir -p /mongo
WORKDIR /mongo
RUN wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.6.1.tgz
RUN tar -xzvf mongodb-linux-x86_64-3.6.1.tgz
RUN rm mongodb-linux-x86_64-3.6.1.tgz
COPY run-mongo.sh /mongo/run-mongo.sh
COPY run-api.sh /mongo/run-api.sh
COPY topology /mongo/topology
COPY isolate.sh /mongo/isolate.sh
COPY rejoin.sh /mongo/rejoin.sh
COPY mongo.conf /etc/supervisor/conf.d/mongo.conf
COPY mongo-etcd /mongo/mongo-etcd
WORKDIR /mongo/mongo-etcd
RUN npm install
WORKDIR /mongo
CMD /usr/bin/supervisord -n