const pairSubdevice = require('./pair');
const installProtocol = require('./installProtocol');

module.exports = function handleMessageFn(device, knownDevices) {
  return function handleMessage(topicName, payload) {
    const topicMess = JSON.parse(payload.toString());
    const task = topicMess.id;
    switch (task) {
      case 'pairSubdevice': {
        pairSubdevice(device, topicMess, knownDevices);
        break;
      }
      case 'addProtocol': {
        console.log('add protocol');
        installProtocol(device, topicMess, topicName);
        break;
      }
      default: {
        console.log('default case');
        break;
      }
    }
  };
};
