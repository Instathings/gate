const debug = require('debug');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const AddOnHandler = require('../../AddOnHandler');

const log = debug('gate:log');
log.log = console.log.bind(console); // don't forget to bind to console!
const logError = debug('gate:error');
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
  log(`Publishing on topic ${topicNotify}`);
  log(JSON.stringify(payload));
  /**
   * Waiting 1 sec to let the discovering message to be processed
   * otherwise race conditions may arise and the pairing message would
   * be the latest message processed
   */
  setTimeout(() => {
    this.device.publish(topicNotify, JSON.stringify(payload));
  }, 1000);
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
      logError(err);
    }
    log('File written successfully');
  });
};
