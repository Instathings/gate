const debug = require('debug')('gate');

module.exports = function onStatusFn(deviceAWS) {
  /**
      const response = {
          payload: parsed, // message coming from device
          requestId: message.requestId,
          deviceId: message.deviceId,
          projectId: process.env.PROJECT_ID
        };
   */
  return function onStatus(message) {
    const clientId = `${process.env.NODE_ENV}-${process.env.PARENT_DEVICE_ID}`;
    let topic = `control/${message.projectId}/${clientId}/${message.deviceId}/fetch`;
    if (process.env.NODE_ENV !== 'production') {
      topic = `${process.env.NODE_ENV}-${topic}`;
    }
    debug(JSON.stringify(message));
    debug('PUBLISH TOPIC', topic);
    deviceAWS.publish(topic, JSON.stringify(message));
  };
};
