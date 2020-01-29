const _ = require('lodash');

module.exports = function publishData(device, data, topic, callback) {
  device.publish(topic, JSON.stringify(data));
  return callback();
};
