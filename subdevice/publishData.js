const debug = require('debug')('gate');

module.exports = function publishData(device, data, topic, callback) {
  debug(`Publish data on ${topic}`);
  debug(JSON.stringify(data));
  device.publish(topic, JSON.stringify(data));
  return callback();
};
