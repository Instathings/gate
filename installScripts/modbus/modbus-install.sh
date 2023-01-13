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

# modbus
cd /home/node/gate/service
mkdir modbus
chmod -R 777 modbus
cd modbus
mkdir data
chmod -R 777 data
cp /home/node/gate/installScripts/modbus/modbus2mqtt/configuration.yaml /home/node/gate/service/modbus/data/configuration.yaml


docker run \
   -dt \
   -v /home/$HOST_USERNAME/service/modbus/data:/app/data \
   --device=/dev/ttyUSB0 \
   -e TZ=GMT \
   -v /run/udev:/run/udev:ro \
   --privileged=true \
   --name instathings-modbus2mqtt \
   --network gate-net \
   --restart=always \
   instathings/modbus2mqtt:1.1.6
   