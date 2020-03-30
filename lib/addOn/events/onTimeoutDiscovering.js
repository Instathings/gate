const debug = require('debug')('gate');

module.exports = function onPairingTimeout(payload) {
  const topicNotify = this.topic.replace('/post', '');
  debug(`Publishing on topic ${topicNotify}`);
  debug(JSON.stringify(payload));
  this.device.publish(topicNotify, JSON.stringify(payload));
};
