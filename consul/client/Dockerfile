FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y iputils-ping vim tmux less
RUN apt-get install -y nodejs npm
RUN npm install --global node-nightly
RUN node-nightly
RUN mkdir -p /consul
WORKDIR /consul
COPY test.sh /consul/test.sh
COPY app /consul/app
COPY lib /consul/lib
WORKDIR /consul/app
RUN npm install
WORKDIR /consul
CMD /consul/test.sh
