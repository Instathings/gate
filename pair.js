const debug = require('debug')('gate');
const initAddOn = require('./subdevice/initAddOn');
const publishData = require('./subdevice/publishData');
const onNewDeviceFn = require('./events/onNewDevice');
const onPairingTimeoutFn = require('./events/onPairingTimeout');

module.exports = function pairSubdevice(topicNotify, device, topicMess, knownDevices) {
  const responseTopic = topicNotify.replace('/post', '');

  const { topic } = topicMess;
  const { idIn } = topicMess;
  const { deviceType } = topicMess;
  const onNewDevice = onNewDeviceFn(knownDevices, idIn, topic, deviceType, responseTopic, device);
  const onPairingTimeout = onPairingTimeoutFn(responseTopic, device);
  return initAddOn(idIn, deviceType, knownDevices, (err, addOnInstance) => {
    addOnInstance.init();
    debug('start discovering device...');

    const payload = {
      status: {
        eventType: 'discovering',
      },
      deviceId: idIn,
    };
    debug(`Publishing on topic ${responseTopic}`);
    debug(JSON.stringify(payload));
    device.publish(responseTopic, JSON.stringify(payload));

    addOnInstance.on('data', (data) => {
      return publishData(device, data, topic, (error) => {
        if (error) {
          debug(error);
        }
      });
    });
    addOnInstance.on('newDevice', onNewDevice);
    addOnInstance.on('timeoutDiscovering', onPairingTimeout);
  });
};
