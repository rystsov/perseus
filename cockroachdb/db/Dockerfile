FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y wget supervisor iptables
RUN apt-get install -y iputils-ping vim tmux less
RUN mkdir -p /roach
WORKDIR /roach
RUN wget https://binaries.cockroachdb.com/cockroach-latest.linux-amd64.tgz
RUN tar xzvf cockroach-latest.linux-amd64.tgz
RUN rm cockroach-latest.linux-amd64.tgz
COPY run-roach.sh /roach/run-roach.sh
COPY isolate.sh /roach/isolate.sh
COPY rejoin.sh /roach/rejoin.sh
COPY cockroachdb.conf /etc/supervisor/conf.d/cockroachdb.conf
CMD /usr/bin/supervisord -n