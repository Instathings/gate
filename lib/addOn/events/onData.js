const debug = require('debug')('gate');

module.exports = function onData(topic, data) {
  debug(`Publish data on ${topic}`);
  debug(JSON.stringify(data));
  this.device.publish(topic, JSON.stringify(data));
};
