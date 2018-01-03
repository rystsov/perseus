FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y iputils-ping vim tmux less
RUN apt-get install -y nodejs npm mysql-client
RUN npm install --global node-nightly
RUN node-nightly
RUN mkdir -p /tidb
WORKDIR /tidb
COPY test.sh /tidb/test.sh
COPY schema.sql /tidb/schema.sql
COPY app /tidb/app
COPY lib /tidb/lib
WORKDIR /tidb/app
RUN npm install
WORKDIR /tidb
CMD ["/tidb/test.sh"]
