const _ = require('lodash');

module.exports = function publishData(device, data, topic, callback) {
  console.log('PUBLISH', JSON.stringify(data), topic);
  device.publish(topic, JSON.stringify(data));
  return callback();
};
