# mosquitto configuration
cd /home/node/gate/service
mkdir mosquitto
cd mosquitto
mkdir config
mkdir data
mkdir log
chmod -R 777 config
chmod -R 777 data
chmod -R 777 log
cp /home/node/gate/installScripts/zigbee/mosquitto/mosquitto.conf /home/node/gate/service/mosquitto/config
# mosquitto container
docker run -dt \
-p 1883:1883 -p 9001:9001 \
-v /home/$HOST_USERNAME/service/mosquitto/config:/mosquitto/config \
-v /home/$HOST_USERNAME/service/mosquitto/data:/mosquitto/data \
-v /home/$HOST_USERNAME/service/mosquitto/log:/mosquitto/log \
--name eclipse-mosquitto \
--network gate-net \
--restart=always \
 eclipse-mosquitto:1.6.9

# zigbee2mqtt
cd /home/node/gate/service
mkdir zigbee2mqtt
chmod -R 777 zigbee2mqtt
cd zigbee2mqtt
mkdir data
chmod -R 777 data
cp /home/node/gate/installScripts/zigbee/zigbee2mqtt/configuration.yaml /home/node/gate/service/zigbee2mqtt/data/configuration.yaml


docker run \
   -dt \
   -v /home/$HOST_USERNAME/service/zigbee2mqtt/data:/app/data \
   --device=/dev/ttyACM0 \
   -e TZ=GMT \
   -v /run/udev:/run/udev:ro \
   --privileged=true \
   --name koenkk-zigbee2mqtt \
   --network gate-net \
   --restart=always \
   koenkk/zigbee2mqtt:1.12.2
