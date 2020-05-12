const mqtt = require('mqtt');

var client = mqtt.connect('mqtt://localhost')

client.on('connect', function () {
  client.subscribe('presence', function (err) {

  });
  const payload = {
    state: ''
  };
  client.publish('zigbee2mqtt/0x0017880103f67ea9/get', JSON.stringify(payload));
})

client.on('message', function (topic, message) {
  console.log(message.toString());
})


