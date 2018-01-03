FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y iputils-ping vim tmux less
RUN apt-get install -y nodejs npm
RUN npm install --global node-nightly
RUN node-nightly
RUN mkdir -p /etcd
WORKDIR /etcd
COPY test.sh /etcd/test.sh
COPY app /etcd/app
COPY lib /etcd/lib
WORKDIR /etcd/app
RUN npm install
WORKDIR /etcd
CMD /etcd/test.sh
