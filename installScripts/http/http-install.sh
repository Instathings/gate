# mosquitto container
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

# http2mqtt container
TAG_HTTP=`wget -q https://registry.hub.docker.com/v1/repositories/instathings/http2mqtt/tags -O -         | tr -d '[]" ' | tr '}' '\n' | awk -F: '{print $3}'| grep -v staging| tail -n 1`
if [ ! -z $1 ] && [ $1 == 'staging' ]
then
  TAG_HTTP=staging
fi

echo "Using tag $TAG_HTTP"

cd /home/node/gate/service
mkdir http
chmod -R 777 http
cd http
mkdir data
chmod -R 777 data
cd data
cat > configuration.yaml <<EOL
mqtt:
  base_topic: http2mqtt
  server: 'mqtt://eclipse-mosquitto'
EOL

docker pull instathings/http2mqtt:$TAG_HTTP

docker run \
-dt \
-v /home/$HOST_USERNAME/service/http/data:/app/data \
-e TZ=GMT \
-v /run/udev:/run/udev:ro \
--privileged=true \
--name instathings-http2mqtt \
--network gate-net \
--restart=always \
instathings/http2mqtt:$TAG_HTTP