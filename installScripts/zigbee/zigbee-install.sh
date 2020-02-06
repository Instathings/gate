# mosquitto configuration
cd /home/node/gate/service
mkdir mosquitto && cd mosquitto
mkdir config && mkdir data && mkdir log
cp /home/node/gate/installScripts/zigbee/mosquitto/mosquitto.conf /home/node/gate/service/mosquitto/config
# mosquitto container
docker run -dt \
-p 1883:1883 -p 9001:9001 \
-v ~/gate/service/mosquitto/config:/mosquitto/config \
-v ~/gate/service/mosquitto/data:/mosquitto/data \
-v ~/gate/service/mosquitto/log:/mosquitto/log \
 eclipse-mosquitto
