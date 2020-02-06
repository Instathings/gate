const async = require('async');
const initAddOn = require('./subdevice/initAddOn');
const publishData = require('./subdevice/publishData');

module.exports = function startRoutine(device, knownDevices) {
  if (knownDevices === {}) {
    return;
  }
  const protocols = Object.keys(knownDevices);

  async.eachSeries(protocols, (protocol, protCall) => {
    const devices = knownDevices[protocol];
    async.eachSeries(devices, (knownDevice, deviceCall) => {
      const { addOn } = knownDevice;
      initAddOn(addOn, knownDevices, (err, addOnInstance) => {
        addOnInstance.start(knownDevice);
        addOnInstance.on('data', (data) => {
          const { topic } = knownDevice;
          publishData(device, data, topic, (error) => {
            if (error) {
              console.log(error);
            }
          });
        });
        deviceCall();
      });
    }, () => {
      protCall();
      console.log('fine devices');
    });
  }, () => {
    console.log('fine protocolli');
  });
};