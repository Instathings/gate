const _ = require('lodash');
const AddOnHandler = require('./AddOnHandler');

module.exports = function publishControlMessage(topicName, device, message, knownDevices) {
  const splitted = topicName.split('/');
  const deviceId = _.get(splitted, '[3]');
  const addOnHandler = AddOnHandler.getInstance();
  const addOnInstance = addOnHandler.get(deviceId);
  addOnInstance.control(message);
};