# mosquitto configuration
cd /home/gate/service
mkdir mosquitto && cd mosquitto
mkdir config && mkdir data && mkdir log
cp /home/gate/installScripts/zigbee/mosquitto/mosquitto.conf /home/gate/service/mosquitto/config
# mosquitto container
docker run -dt \
-p 1883:1883 -p 9001:9001 \
-v ~/service/mosquitto/config:/mosquitto/config \
-v ~/service/mosquitto/data:/mosquitto/data \
-v ~/service/mosquitto/log:/mosquitto/log \
 eclipse-mosquitto
