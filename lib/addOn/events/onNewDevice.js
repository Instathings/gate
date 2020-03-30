const debug = require('debug')('gate');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const AddOnHandler = require('../../AddOnHandler');

const HOST_PATH = path.join(__dirname, '..', '..', '..', 'knownDevices.config');
const DOCKER_PATH = '/home/node/gate/service/knownDevices.config';

function publishStatusUpdate() {
  const topicNotify = this.topic.replace('/post', '');
  const deviceId = this.message.idIn;
  const payload = {
    status: {
      eventType: 'paired',
    },
    deviceId,
  };
  debug(`Publishing on topic ${topicNotify}`);
  debug(JSON.stringify(payload));
  this.device.publish(topicNotify, JSON.stringify(payload));
}

module.exports = function onNewDevice(newDevice) {
  publishStatusUpdate.call(this);
  const { topic, deviceType, name } = this.message;
  const deviceId = this.message.idIn;

  const protocol = _.get(deviceType, 'protocols[0]');
  const devices = this.knownDevices[protocol];
  _.unset(newDevice, 'protocol');
  const device = {
    id: deviceId,
    topic,
    deviceType,
    name,
    ...newDevice,
  };
  if (!devices) {
    _.set(this.knownDevices, protocol, [device]);
    const addOnHandler = AddOnHandler.getInstance();
    const instance = addOnHandler.get(device.id);
    instance.setKnownDevices(this.knownDevices[protocol]);
  } else {
    devices.push(device);
    devices.forEach((deviceLoop) => {
      const { id } = deviceLoop;
      const addOnHandler = AddOnHandler.getInstance();
      const instance = addOnHandler.get(id);
      instance.setKnownDevices(this.knownDevices[protocol]);
    });
  }

  let configPath = DOCKER_PATH;
  if (process.env.IS_HOST === 'true') {
    configPath = HOST_PATH;
  }
  return fs.writeFile(configPath, JSON.stringify(this.knownDevices), (err) => {
    if (err) {
      debug(err);
    }
    debug('File written successfully');
  });
};
