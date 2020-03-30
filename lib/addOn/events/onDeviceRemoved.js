const debug = require('debug')('gate');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const AddOnHandler = require('../../AddOnHandler');

const HOST_PATH = path.join(__dirname, '..', '..', '..', 'knownDevices.config');
const DOCKER_PATH = '/home/node/gate/service/knownDevices.config';

function publishStatusUpdate(topic, deviceId) {
  const topicNotify = topic.replace('/post', '');
  const payload = {
    status: {
      eventType: 'not_paired',
    },
    deviceId,
  };
  debug(`Publishing on topic ${topicNotify}`);
  debug(JSON.stringify(payload));
  this.device.publish(topicNotify, JSON.stringify(payload));
}

module.exports = function onRemovedDeviceFn(deviceType, options = {}) {
  const topic = options.removeTopic || this.topic;
  return function onRemovedDevice(deviceId) {
    publishStatusUpdate.call(this, topic, deviceId);

    const addOnHandler = AddOnHandler.getInstance();
    addOnHandler.remove(deviceId);

    const protocol = deviceType.protocols[0];
    const devices = this.knownDevices[protocol];
    _.remove(devices, (device) => device.id === deviceId);

    let configPath = DOCKER_PATH;
    if (process.env.IS_HOST === 'true') {
      configPath = HOST_PATH;
    }
    return fs.writeFile(configPath, JSON.stringify(this.knownDevices), (err) => {
      if (err) {
        debug(err);
      }
      debug('File updated successfully, device removed');
    });
  }.bind(this);
};
