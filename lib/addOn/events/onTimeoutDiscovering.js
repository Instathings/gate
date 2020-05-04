const debug = require('debug');

const log = debug('gate:log');
log.log = console.log.bind(console);

const AddOnHandler = require('../../AddOnHandler');

module.exports = function onPairingTimeout(payload) {
  const topicNotify = this.topic.replace('/post', '');
  log(`Publishing on topic ${topicNotify}`);
  const addOnHandler = AddOnHandler.getInstance();
  const { deviceId } = payload;
  addOnHandler.remove(deviceId);
  log(JSON.stringify(payload));
  this.device.publish(topicNotify, JSON.stringify(payload));
};
