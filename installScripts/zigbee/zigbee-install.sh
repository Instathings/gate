# mosquitto configuration
cd /home/node/gate/service
mkdir mosquitto && cd mosquitto
mkdir config && mkdir data && mkdir log
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
 eclipse-mosquitto
