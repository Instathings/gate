const debug = require('debug')('gate');
const installAddOn = require('./installAddOn');
const AddOnHandler = require('../AddOnHandler');

module.exports = function initAddOn(deviceId, deviceType, knownDevices, callback) {
  const addOnHandler = AddOnHandler.getInstance();
  const { addOn, pairingMethods } = deviceType;
  let GateAddOnClass;
  try {
    GateAddOnClass = require(addOn);
  } catch (error) {
    debug('installing addOn');
    return installAddOn(deviceId, deviceType, knownDevices, (err, addOnInstance) => {
      if (err) {
        debug(err);
      }
      addOnHandler.add(addOnInstance);
      return callback(null, addOnInstance);
    });
  }
  let options = {};
  if (pairingMethods) {
    options = {
      touchlink: pairingMethods.indexOf('touchlink') !== -1,
    };
  }
  const addOnInstance = new GateAddOnClass(deviceId, knownDevices, options);
  debug('created device instance');

  addOnHandler.add(addOnInstance);
  return callback(null, addOnInstance);
};
