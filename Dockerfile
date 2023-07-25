FROM node:12.16.2
RUN MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1) && \
  if [ "$MAJOR_VERSION" = "12" ] ; then \
  echo "deb [trusted=yes] http://archive.debian.org/debian stretch main non-free contrib" > /etc/apt/sources.list && \
  echo 'deb-src [trusted=yes] http://archive.debian.org/debian/ stretch main non-free contrib'  >> /etc/apt/sources.list && \
  echo 'deb [trusted=yes] http://archive.debian.org/debian-security/ stretch/updates main non-free contrib'  >> /etc/apt/sources.list; \
  fi
RUN apt-get update
RUN apt-get install -y git nano
USER node
WORKDIR /home/node
RUN pwd
RUN git clone https://github.com/Instathings/gate.git
WORKDIR /home/node/gate
RUN git checkout development
RUN npm install 
VOLUME /home/gate/config
VOLUME [ "/home/node/gate/service" ]
ENV DEBUG gate:*
CMD node index.js
