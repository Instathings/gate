
cd /home/node/gate/service
mkdir node-red

docker run \
   -dt \
   -p 1880:1880 \
   -v /home/pi/service/:/home/node/node-red/service \
   -v /home/pi/service/node-red:/data \
   --name node-red \
   --network gate-net \
   --restart=always \
   nodered/node-red:1.0.4
