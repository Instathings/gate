const debug = require('debug')('gate');

module.exports = function onStatus(message) {
  /**
    const response = {
        payload: parsed, // message coming from device
        requestId: message.requestId,
        deviceId: message.deviceId,
        projectId: process.env.PROJECT_ID
      };
   */
  let topic = `control/${message.projectId}/${this.clientId}/${message.deviceId}/fetch`;
  if (process.env.NODE_ENV !== 'production') {
    topic = `${process.env.NODE_ENV}-${topic}`;
  }
  debug(`Publich on topic ${topic}`);
  debug(JSON.stringify(message));
  this.device.publish(topic, JSON.stringify(message));
};
