const debug = require('debug')('gate');
const async = require('async');
const initAddOn = require('./subdevice/initAddOn');
const publishData = require('./subdevice/publishData');
const onStatusFn = require('./events/onStatus');

module.exports = function startRoutine(device, knownDevices) {
  const onStatus = onStatusFn(device);
  if (knownDevices === {}) {
    return;
  }
  const protocols = Object.keys(knownDevices);

  async.eachSeries(protocols, (protocol, protCall) => {
    const devices = knownDevices[protocol];
    async.eachSeries(devices, (knownDevice, deviceCall) => {
      const { deviceType, id } = knownDevice;
      initAddOn(id, deviceType, knownDevices, (err, addOnInstance) => {
        addOnInstance.start(knownDevice);
        addOnInstance.on('data', (data) => {
          const { topic } = knownDevice;
          publishData(device, data, topic, (error) => {
            if (error) {
              console.log(error);
            }
          });
        });
        addOnInstance.on('status', onStatus);
        deviceCall();
      });
    }, () => {
      protCall();
      debug(`Processed all devices of ${protocol}`);
    });
  }, () => {
    debug('Read all protocols from saved device file');
  });
};
