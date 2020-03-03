const debug = require('debug')('gate');
const async = require('async');
const initAddOn = require('./subdevice/initAddOn');
const publishData = require('./subdevice/publishData');
const onStatusFn = require('./events/onStatus');
const onRemovedDeviceFn = require('./events/onRemovedDevice');

module.exports = function startRoutine(device, knownDevices, discoverBaseTopic) {
  const responseTopic = `${discoverBaseTopic}/device`;
  const onStatus = onStatusFn(device);
  if (knownDevices === {}) {
    return;
  }
  const protocols = Object.keys(knownDevices);

  async.eachSeries(protocols, (protocol, protCall) => {
    const devices = knownDevices[protocol];
    async.eachSeries(devices, (knownDevice, deviceCall) => {
      const { deviceType, id } = knownDevice;
      const onRemovedDevice = onRemovedDeviceFn(knownDevices, deviceType, responseTopic, device);
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
        addOnInstance.on('deviceRemoved', onRemovedDevice)
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
