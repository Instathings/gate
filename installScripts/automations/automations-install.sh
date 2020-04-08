
cd /home/node/gate/service
mkdir node-red

docker run \
   -dt \
   -p 1880:1880 \
   -v /home/$HOST_USERNAME/service/:/home/node/node-red/service \
   -v /home/$HOST_USERNAME/service/node-red:/data \
   --name node-red \
   --network gate-net \
   --restart=always \
   nodered/node-red:1.0.4

   npm i @instathings/device-in
   npm i @instathings/device-out

   docker restart node-red
