const debug = require('debug');

const _ = require('lodash');
const async = require('async');
const installAddOn = require('./installAddOn');
const AddOnHandler = require('../../AddOnHandler');

const log = debug('gate:log');
log.log = console.log.bind(console);
const logError = debug('gate:error');


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
    case '@instathings/gate-addon-modbus':
      try {
        // eslint-disable-next-line
        GateAddOnClass = require('@instathings/gate-addon-modbus');
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

module.exports = function initAddOnFn(deviceId, deviceType, parametersValue) {
  return function initAdd(callback) {
    const { addOn, pairingMethods, parameters } = deviceType;
    async.waterfall([
      (wfCb) => {
        let GateAddOnClass = getClass(addOn);
        if (GateAddOnClass) {
          return wfCb(null, GateAddOnClass);
        }
        log(`Installing addon ${addOn}`);
        return installAddOn(addOn, (err) => {
          if (err) {
            logError(err);
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
        if (parameters) {
          parameters.forEach((parameter) => {
            const { id } = parameter;
            const value = _.get(parametersValue, id);
            _.set(options, id, value);
          });
        }
        const addOnInstance = new GateAddOnClass(deviceId, deviceType, this.knownDevices, options);
        log('Device instance created');
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
