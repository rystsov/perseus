FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y iputils-ping vim tmux less curl
RUN /bin/bash -c "curl -sL https://deb.nodesource.com/setup_8.x | bash -"
RUN apt-get install -y nodejs
RUN mkdir -p /rethink
WORKDIR /rethink
COPY test.sh /rethink/test.sh
COPY app /rethink/app
COPY lib /rethink/lib
WORKDIR /rethink/app
RUN npm install
WORKDIR /rethink
CMD /rethink/test.sh
