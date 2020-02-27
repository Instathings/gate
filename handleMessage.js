const debug = require('debug')('gate');
const pairSubdevice = require('./pair');
const installProtocol = require('./installProtocol');
const publishControlMessage = require('./publishControlMessage');

module.exports = function handleMessageFn(device, knownDevices, discoverBaseTopic, controlBaseTopic) {
  return function handleMessage(topicName, payload) {
    debug(new Date().toISOString());
    debug('Received message on topic', topicName);
    debug(payload.toString());
    const message = JSON.parse(payload.toString());

    switch (topicName) {
      case `${discoverBaseTopic}/device/post`: {
        pairSubdevice(topicName, device, message, knownDevices);
        break;
      }
      case `${discoverBaseTopic}/protocol/post`: {
        const { protocol, protocolId } = message;
        installProtocol(topicName, protocol, protocolId, device);
        break;
      }
      default: {
        // controlB   development-control/ZLS75DhL/development-oMqnhCUd
        // topicName  development-control/ZLS75DhL/development-oMqnhCUd/subdeviceid/set
        debug('Default case');
        const isControl = new RegExp('.*control\/.*\/set$').test(topicName);

        if (isControl) {
          console.log('PUBLISH');
          publishControlMessage(topicName, device, message, knownDevices);
        }
        break;
      }
    }
  };
};
