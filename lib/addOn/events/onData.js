const debug = require('debug');

const log = debug('gate:log');
log.log = console.log.bind(console);

module.exports = function onData(topic, data) {
  debug(`Publish data on ${topic}`);
  debug(JSON.stringify(data));
  this.device.publish(topic, JSON.stringify(data));
};
