const debug = require('debug');

const log = debug('gate:log');
log.log = console.log.bind(console); // don't forget to bind to console!

module.exports = function onStatus(message) {
  /**
    const response = {
        payload: parsed, // message coming from device
        requestId: message.requestId,
        deviceId: message.deviceId,
        projectId: process.env.PROJECT_ID
      };
   */
  const ts = new Date();
  const statusEvent = {
    payload: message.payload,
    deviceId: message.deviceId,
    ts,
  };
  const deviceEvent = {
    action: 'status',
    payload: message.payload,
    ts,
  };
  if (process.env.ON_PREMISE_ENABLED) {
    this.io.emit('status', statusEvent);
    this.io.emit(`${message.deviceId}`, deviceEvent);
    this.io.emit(`status_${message.deviceId}`, message.payload);
  }
  if (process.env.CLOUD_ENABLED === undefined || process.env.CLOUD_ENABLED === true) {
    let topic = `control/${message.projectId}/${this.clientId}/${message.deviceId}/fetch`;
    if (process.env.NODE_ENV !== 'production') {
      topic = `${process.env.NODE_ENV}-${topic}`;
    }
    log(`Publish on topic ${topic}`);
    log(JSON.stringify(message));
    this.device.publish(topic, JSON.stringify(message));
  }
};
