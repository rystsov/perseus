FROM ubuntu:17.10
LABEL maintainer="Denis Rystsov <rystsov.denis@gmail.com>"
RUN apt-get update -y
RUN apt-get install -y iputils-ping vim tmux less curl
RUN /bin/bash -c "curl -sL https://deb.nodesource.com/setup_8.x | bash -"
RUN apt-get install -y nodejs
RUN mkdir -p /yuga
WORKDIR /yuga
COPY test.sh /yuga/test.sh
COPY app /yuga/app
COPY lib /yuga/lib
WORKDIR /yuga/app
RUN npm install
WORKDIR /yuga
CMD /yuga/test.sh
