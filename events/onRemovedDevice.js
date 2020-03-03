const debug = require('debug')('gate');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const AddOnHandler = require('../AddOnHandler');

module.exports = function onRemovedDeviceFn(knownDevices, deviceType, topicNotify, deviceAWS) {
  return function onRemovedDevice(deviceId) {
    const payload = {
      status: {
        eventType: 'not_paired',
      },
      deviceId,
    };
    debug(`Publishing on topic ${topicNotify}`);
    debug(JSON.stringify(payload));
    deviceAWS.publish(topicNotify, JSON.stringify(payload));

    const addOnHandler = AddOnHandler.getInstance();
    addOnHandler.remove(deviceId);

    const protocol = deviceType.protocols[0];
    const devices = knownDevices[protocol];
    _.remove(devices, (device) => {
      return device.id === deviceId;
    })

    const configPath = path.resolve(__dirname, '..', 'knownDevices.config');
    return fs.writeFile(configPath, JSON.stringify(knownDevices), (err) => {
      if (err) {
        debug(err);
      }
      debug('File written successfully');
    });
  };
};
