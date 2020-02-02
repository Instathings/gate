const debug = require('debug');
const installAddOn = require('./installAddOn');

module.exports = function initAddOn(addOn, knownDevices, callback) {
  let GateAddOnClass;
  try {
    GateAddOnClass = require(addOn);

  } catch (error) {
    console.log('ERRRR', error);
    return installAddOn(addOn, knownDevices, (err, addOnInstance) => {
      if (err) {
        console.log(err);
      }
      return callback(null, addOnInstance);
    });
  }
  console.log('known devi', knownDevices);
  const addOnInstance = new GateAddOnClass(knownDevices);
  console.log('created device instance');
  return callback(null, addOnInstance);

};

