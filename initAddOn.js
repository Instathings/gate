const debug = require('debug');
const installAddOn = require('./installAddOn');

module.exports = function initAddOn(addOn, callback) {
  try {
    const GateAddOnClass = require(addOn);
    const addOnInstance = new GateAddOnClass();
    console.log('created device instance');
    return callback(null, addOnInstance);
  } catch (error) {
    return installAddOn(addOn, (err, addOnInstance) => {
      if (err) {
        console.log(err);
      }
      return callback(null, addOnInstance);
    });
  }
};

