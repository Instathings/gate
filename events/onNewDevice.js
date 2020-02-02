const _ = require('lodash');
const fs = require('fs');
const path = require('path');

module.exports = function onNewDeviceFn(knownDevices, id, topic, addOn) {
  return function onNewDevice(newDevice) {
    const { protocol } = newDevice;
    const devices = knownDevices[protocol];
    _.unset(newDevice, 'protocol');
    const device =
    {
      id,
      topic,
      addOn,
      ...newDevice,
    }
    if (!devices) {
      _.set(knownDevices, protocol, [device]);
    } else {
      devices.push(device);
    }
    const configPath = path.resolve(__dirname, '..', 'knownDevices.config');
    console.log('========= I KNOWN SONO', knownDevices)
    console.log('SCRIVO NUOVI DISPOSITIVI', configPath, knownDevices);
    fs.writeFile(configPath, JSON.stringify(knownDevices), (err) => {
      console.log('file written')
    });
    return;
  }
}