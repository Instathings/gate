const async = require('async');
const initAddOn = require('./initAddOn');
const publishData = require('./publishData');

module.exports = function startRoutine(device, knownDevices) {
  if (knownDevices === {}) {
    return;
  }
  const protocols = Object.keys(knownDevices);
  console.log('PROTOCOLS', protocols);

  async.eachSeries(protocols, (protocol, protCall) => {
    const devices = knownDevices[protocol];
    async.eachSeries(devices, (knownDevice, deviceCall) => {
      const { addOn } = knownDevice;
      console.log('addon', addOn);
      console.log('DEVICE', knownDevice);
      initAddOn(addOn, knownDevices, (err, addOnInstance) => {
        addOnInstance.start(knownDevice);
        addOnInstance.on('data', (data) => {
          const { topic } = knownDevice;
          publishData(device, data, topic, (err) => {
            if (err) {
              console.log(err);
            }
          })
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