FROM ubuntu:17.04
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y wget supervisor iptables
RUN apt-get install -y iputils-ping vim tmux less
RUN /bin/bash -c 'source /etc/lsb-release && echo "deb http://download.rethinkdb.com/apt $DISTRIB_CODENAME main" | tee /etc/apt/sources.list.d/rethinkdb.list'
RUN /bin/bash -c 'wget -qO- https://download.rethinkdb.com/apt/pubkey.gpg | apt-key add -'
RUN apt-get update -y 
RUN apt-get install -y rethinkdb
RUN mkdir -p /rethink
COPY run-rethink.sh /rethink/run-rethink.sh
COPY isolate.sh /rethink/isolate.sh
COPY rejoin.sh /rethink/rejoin.sh
COPY rethink.conf /etc/supervisor/conf.d/rethink.conf
CMD /usr/bin/supervisord -n
