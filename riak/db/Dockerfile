FROM ubuntu:16.04
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y vim lsof supervisor iptables iputils-ping tmux less curl
RUN mkdir /riak
WORKDIR /riak
RUN /bin/bash -c "curl -s https://packagecloud.io/install/repositories/basho/riak/script.deb.sh | bash"
RUN apt-get install -y riak=2.2.3-1
COPY run-riak.sh /riak/run-riak.sh
COPY join-riak1.sh /riak/join-riak1.sh
COPY isolate.sh /riak/isolate.sh
COPY rejoin.sh /riak/rejoin.sh
COPY riak.conf /etc/supervisor/conf.d/riak.conf
CMD /usr/bin/supervisord -n