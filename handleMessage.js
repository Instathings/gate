const debug = require('debug')('gate');
const pairSubdevice = require('./pair');
const installProtocol = require('./installProtocol');

module.exports = function handleMessageFn(device, knownDevices, discoverBaseTopic) {
  return function handleMessage(topicName, payload) {
    debug(new Date().toISOString());
    debug('Received message on topic', topicName);
    debug(payload.toString());
    const message = JSON.parse(payload.toString());

    switch (topicName) {
      case `${discoverBaseTopic}/device/post`: {
        pairSubdevice(device, message, knownDevices);
        break;
      }
      case `${discoverBaseTopic}/protocol/post`: {
        const { protocol, protocolId } = message;
        installProtocol(topicName, protocol, protocolId, device);
        break;
      }
      default: {
        debug('Default case');
        break;
      }
    }
  };
};
