FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y wget supervisor iptables
RUN apt-get install -y iputils-ping vim tmux less
RUN mkdir -p /yuga
WORKDIR /yuga
RUN wget https://downloads.yugabyte.com/yugabyte-ce-0.9.1.0-linux.tar.gz
RUN tar xfz yugabyte-ce-0.9.1.0-linux.tar.gz
RUN rm yugabyte-ce-0.9.1.0-linux.tar.gz
RUN /yuga/yugabyte-0.9.1.0/bin/post_install.sh
RUN mkdir /yuga/mem
COPY run-yb-master.sh /yuga/run-yb-master.sh
COPY run-yb-tserver.sh /yuga/run-yb-tserver.sh
COPY enable-redis.sh /yuga/enable-redis.sh
COPY isolate.sh /yuga/isolate.sh
COPY rejoin.sh /yuga/rejoin.sh
COPY yuga.conf /etc/supervisor/conf.d/yuga.conf
CMD /usr/bin/supervisord -n
