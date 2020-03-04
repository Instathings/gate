const debug = require('debug')('gate');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const AddOnHandler = require('../AddOnHandler');

module.exports = function onNewDeviceFn(knownDevices, id, topic, deviceType, topicNotify, deviceAWS) {
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

    const protocol = deviceType.protocols[0];

    const devices = knownDevices[protocol];
    _.unset(newDevice, 'protocol');
    const device = {
      id,
      topic,
      deviceType,
      ...newDevice,
    };
    if (!devices) {
      _.set(knownDevices, protocol, [device]);
      const addOnHandler = AddOnHandler.getInstance();
      const instance = addOnHandler.get(device.id);
      instance.setKnownDevices(knownDevices[protocol]);
    } else {
      devices.push(device);
      devices.forEach((deviceLoop) => {
        const deviceId = deviceLoop.id;
        const addOnHandler = AddOnHandler.getInstance();
        const instance = addOnHandler.get(deviceId);
        instance.setKnownDevices(knownDevices[protocol]);
      });
    }

    const configPath = path.resolve(__dirname, '..', 'knownDevices.config');
    return fs.writeFile(configPath, JSON.stringify(knownDevices), (err) => {
      if (err) {
        debug(err);
      }
      debug('File written successfully');
    });
  };
};
