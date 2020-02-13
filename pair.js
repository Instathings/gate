const debug = require('debug')('gate');
const initAddOn = require('./subdevice/initAddOn');
const publishData = require('./subdevice/publishData');
const onNewDeviceFn = require('./events/onNewDevice');

module.exports = function pairSubdevice(device, topicMess, knownDevices) {
  const { topic } = topicMess;
  const { idIn } = topicMess;
  // const { deviceType } = topicMess;
  const { addOn } = topicMess;
  const onNewDevice = onNewDeviceFn(knownDevices, idIn, topic, addOn);
  return initAddOn(addOn, knownDevices, (err, addOnInstance) => {
    addOnInstance.init();
    debug('start discovering device...');
    addOnInstance.on('data', (data) => {
      return publishData(device, data, topic, (error) => {
        if (error) {
          debug(error);
        }
      });
    });
    addOnInstance.on('newDevice', onNewDevice);
  });
};
