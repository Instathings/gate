const debug = require('debug')('gate');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

module.exports = function onNewDeviceFn(knownDevices, id, topic, addOn, topicNotify, deviceAWS) {
  return function onNewDevice(newDevice) {
    const payload = {
      status: {
        eventType: 'paired',
      },
      deviceId: id,
    };
    debug(`Publishing on topic ${topicNotify}`);
    debug(JSON.stringify(payload));
    deviceAWS.publish(topicNotify, JSON.stringify(payload));

    const { protocol } = newDevice;
    const devices = knownDevices[protocol];
    _.unset(newDevice, 'protocol');
    const device = {
      id,
      topic,
      addOn,
      ...newDevice,
    };
    if (!devices) {
      _.set(knownDevices, protocol, [device]);
    } else {
      devices.push(device);
    }
    const configPath = path.resolve(__dirname, '..', 'knownDevices.config');
    return fs.writeFile(configPath, JSON.stringify(knownDevices), (err) => {
      if (err) {
        debug(err);
      }
      debug('File written successfully');
    });
    return;
  };
};
