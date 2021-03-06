FROM node:12.16.2
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
