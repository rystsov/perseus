FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y iputils-ping vim tmux less
RUN apt-get install -y nodejs npm
RUN npm install --global node-nightly
RUN node-nightly
RUN mkdir -p /mongo
WORKDIR /mongo
COPY test.sh /mongo/test.sh
COPY app /mongo/app
COPY lib /mongo/lib
WORKDIR /mongo/app
RUN npm install
WORKDIR /mongo
CMD /mongo/test.sh
