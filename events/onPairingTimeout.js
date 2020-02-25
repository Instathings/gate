const debug = require('debug')('gate');

module.exports = function onPairingTimeoutFn(topicNotify, deviceAWS) {
  return function onPairingTimeout(payload) {
    debug(`Publishing on topic ${topicNotify}`);
    debug(JSON.stringify(payload));
    deviceAWS.publish(topicNotify, JSON.stringify(payload));
  };
};
