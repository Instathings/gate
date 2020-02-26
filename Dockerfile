FROM node:12.14.1
RUN apt-get update
RUN apt-get install -y git 
USER node
WORKDIR /home/node
RUN pwd
RUN git clone https://github.com/Instathings/gate.git
WORKDIR /home/node/gate
RUN git checkout development
RUN npm install 
VOLUME /home/gate/config
VOLUME [ "/home/node/gate/service" ]
ENV DEBUG gate
CMD node index.js
