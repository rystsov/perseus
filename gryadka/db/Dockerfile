FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y wget supervisor iptables
RUN apt-get install -y iputils-ping vim tmux less
RUN apt-get install -y redis-server
RUN mkdir -p /gryadka
WORKDIR /gryadka
COPY isolate.sh /gryadka/isolate.sh
COPY rejoin.sh /gryadka/rejoin.sh
COPY redis.conf /gryadka/redis.conf
COPY run-redis.sh /gryadka/run-redis.sh
RUN apt-get install -y nodejs npm
RUN npm install --global node-nightly
RUN node-nightly
COPY gryadka-etcd /gryadka/gryadka-etcd
WORKDIR /gryadka/gryadka-etcd
RUN npm install
WORKDIR /gryadka
COPY cluster.json /gryadka/cluster.json
COPY run-gryadka.sh /gryadka/run-gryadka.sh
COPY gryadka.conf /etc/supervisor/conf.d/gryadka.conf
CMD /usr/bin/supervisord -n
