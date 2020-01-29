const _ = require('lodash');
module.exports = function publishData(device, topic, callback) {
  console.log('publishing data...');
  setInterval(() => {
    const dataPub = {
      temperature: _.random(1, 6, true),
    }
    device.publish(topic, JSON.stringify(dataPub));
  }, 10000);
  return callback();
};