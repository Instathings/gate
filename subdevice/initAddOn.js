const debug = require('debug')('gate');
const installAddOn = require('./installAddOn');

module.exports = function initAddOn(topicMess, knownDevices, callback) {
  const { addOn, deviceType } = topicMess;
  const { pairingMethods } = deviceType;
  let GateAddOnClass;
  try {
    GateAddOnClass = require(addOn);
  } catch (error) {
    debug('installing addOn');
    return installAddOn(addOn, knownDevices, (err, addOnInstance) => {
      if (err) {
        debug(err);
      }
      return callback(null, addOnInstance);
    });
  }
  let options = {};
  if (pairingMethods) {
    options = {
      touchlink: pairingMethods.indexOf('touchlink') !== -1,
    };
  }
  const addOnInstance = new GateAddOnClass(knownDevices, options);
  debug('created device instance');
  return callback(null, addOnInstance);
};
