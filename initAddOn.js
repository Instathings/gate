const debug = require('debug');
const installAddOn = require('./installAddOn');

module.exports = function initAddOn(addOn, deviceType, callback) {
  switch (deviceType) {
    case 'pippo':

      break;

    default:
      // sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
      try {
        const GateAddOnSensorTag = require(addOn);
        const gAddSensorTag = new GateAddOnSensorTag();
        console.log('created device instance');
        return callback(null, gAddSensorTag);
      } catch (error) {
        return installAddOn(addOn, (err, gAddOnSensorTag) => {
          if (err) {
            console.log(err);
          }
          return callback(null, gAddOnSensorTag);
        });
      }
      break;
  }
};
