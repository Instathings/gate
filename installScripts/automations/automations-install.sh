
cd /home/node/gate/service
mkdir node-red

docker run \
   -dt \
   -p 1880:1880 \
   -v /home/$HOST_USERNAME/service/:/home/node/node-red/service \
   -v /home/$HOST_USERNAME/service/node-red:/data \
   --name nodered-node-red \
   --network gate-net \
   --restart=always \
   nodered/node-red:1.0.4

docker stop nodered-node-red

cd /home/node/gate/service/node-red

npm i @instathings/node-red-contrib-device-in
npm i @instathings/node-red-contrib-device-out

docker start nodered-node-red
