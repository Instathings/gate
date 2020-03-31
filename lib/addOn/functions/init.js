const debug = require('debug')('gate');
const async = require('async');
const installAddOn = require('./installAddOn');
const AddOnHandler = require('../../AddOnHandler');

function getClass(addOn) {
  let GateAddOnClass;
  switch (addOn) {
    case '@instathings/gate-addon-zigbee':
      try {
        // eslint-disable-next-line
        GateAddOnClass = require('@instathings/gate-addon-zigbee');
      } catch (error) {
        GateAddOnClass = false;
      }
      break;
    default: {
      break;
    }
  }
  return GateAddOnClass;
}

module.exports = function initAddOnFn(deviceId, deviceType) {
  return function initAdd(callback) {
    const { addOn, pairingMethods } = deviceType;
    async.waterfall([
      (wfCb) => {
        let GateAddOnClass = getClass(addOn);
        if (GateAddOnClass) {
          return wfCb(null, GateAddOnClass);
        }
        debug(`Installing addon ${addOn}`);
        return installAddOn(addOn, (err) => {
          if (err) {
            debug(err);
            throw err;
          }
          GateAddOnClass = getClass(addOn);
          return wfCb(null, GateAddOnClass);
        });
      },
      (GateAddOnClass, wfCb) => {
        let options = {};
        if (pairingMethods) {
          options = {
            touchlink: pairingMethods.indexOf('touchlink') !== -1,
          };
        }
        const addOnInstance = new GateAddOnClass(deviceId, deviceType, this.knownDevices, options);
        debug('Device instance created');
        wfCb(null, addOnInstance);
      },
    ], (err, instance) => {
      if (err) {
        return callback(err);
      }
      const addOnHandler = AddOnHandler.getInstance();
      addOnHandler.add(instance);
      return callback(null, instance);
    });
  }.bind(this);
};
