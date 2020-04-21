const debug = require('debug');

const log = debug('gate:log');
log.log = console.log.bind(console); // don't forget to bind to console!

module.exports = function onPairingTimeout(payload) {
  const topicNotify = this.topic.replace('/post', '');
  log(`Publishing on topic ${topicNotify}`);
  log(JSON.stringify(payload));
  this.device.publish(topicNotify, JSON.stringify(payload));
};
