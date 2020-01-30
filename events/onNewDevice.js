const _ = require('lodash');

module.exports = function onNewDeviceFn(knownDevices, id, topic) {
  return function onNewDevice(newDevice) {
    console.log('MEGASTAMPONE', newDevice);
    const { protocol } = newDevice;
    const devices = knownDevices.protocol;
    _.unset(newDevice, 'protocol');
    const device =
    {
      id,
      topic,
      ...newDevice,
    }
    if (!devices) {
      _.set(knownDevices, protocol, [device]);
      console.log('knwn devices', knownDevices);
      return;
    }
    devices.push(device);
    return;
  }
}