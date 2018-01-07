FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y iputils-ping vim tmux less
RUN apt-get install -y nodejs npm
RUN npm install --global node-nightly
RUN node-nightly
RUN mkdir -p /gryadka
WORKDIR /gryadka
COPY test.sh /gryadka/test.sh
COPY app /gryadka/app
COPY lib /gryadka/lib
WORKDIR /gryadka/app
RUN npm install
WORKDIR /gryadka
CMD /gryadka/test.sh
