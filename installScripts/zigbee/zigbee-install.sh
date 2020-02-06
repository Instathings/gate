# mosquitto configuration
cd /home/gate/service
mkdir mosquitto && cd mosquitto
mkdir config && mkdir data && mkdir log
cp mosquitto/mosquitto.config /home/gate/service/config
# mosquitto container
docker run -it \
-p 1883:1883 -p 9001:9001 \
-v /home/gate/service/mosquitto/config:/mosquitto/config \
-v /home/gate/service/mosquitto/data:/mosquitto/data \
-v /home/gate/service/mosquitto/log:/mosquitto/log \
 eclipse-mosquitto