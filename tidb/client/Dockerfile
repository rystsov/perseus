FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y iputils-ping vim tmux less curl
RUN /bin/bash -c "curl -sL https://deb.nodesource.com/setup_8.x | bash -"
RUN apt-get install -y nodejs mysql-client
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
