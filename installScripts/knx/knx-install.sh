CONTAINER_NAME='eclipse-mosquitto'

CID=$(docker ps -q -f status=running -f name=^/${CONTAINER_NAME}$)
# Check if a container named eclipse-mosquitto is running
if [ ! "${CID}" ]; then
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

   docker run -dt \
   -p 1883:1883 -p 9001:9001 \
   -v /home/$HOST_USERNAME/service/mosquitto/config:/mosquitto/config \
   -v /home/$HOST_USERNAME/service/mosquitto/data:/mosquitto/data \
   -v /home/$HOST_USERNAME/service/mosquitto/log:/mosquitto/log \
   --name eclipse-mosquitto \
   --network gate-net \
   --restart=always \
   eclipse-mosquitto:1.6.9
fi

# knx 
cd /home/node/gate/service
mkdir knx
chmod -R 777 knx
cd knx
mkdir data
chmod -R 777 data
cd data
cat > configuration.yaml <<EOL
mqtt:
  base_topic: knx2mqtt
  server: 'mqtt://eclipse-mosquitto'
knx:
  ip_address: $1
  port: $2
advanced:
  log_output:
    - console
EOL
docker pull instathings/knx2mqtt:1.0.1

docker run \
-dt \
-v /home/$HOST_USERNAME/service/knx/data:/app/data \
-e TZ=GMT \
-v /run/udev:/run/udev:ro \
--privileged=true \
--name instathings-knx2mqtt \
--network gate-net \
--restart=always \
instathings/knx2mqtt:1.0.1

