const debug = require('debug')('gate');
const initAddOn = require('./subdevice/initAddOn');
const publishData = require('./subdevice/publishData');
const onNewDeviceFn = require('./events/onNewDevice');
const onStatusFn = require('./events/onStatus');
const onPairingTimeoutFn = require('./events/onPairingTimeout');
const onRemovedDeviceFn = require('./events/onRemovedDevice');

module.exports = function pairSubdevice(topicNotify, device, topicMess, knownDevices) {
  const responseTopic = topicNotify.replace('/post', '');

  const { topic } = topicMess;
  const { idIn } = topicMess;
  const { deviceType } = topicMess;
  const onNewDevice = onNewDeviceFn(knownDevices, idIn, topic, deviceType, responseTopic, device);
  const onRemovedDevice = onRemovedDeviceFn(knownDevices, deviceType, responseTopic, device);
  const onPairingTimeout = onPairingTimeoutFn(responseTopic, device);
  const onStatus = onStatusFn(device);

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
    addOnInstance.on('deviceRemoved', onRemovedDevice);
    addOnInstance.on('status', onStatus);
    addOnInstance.on('timeoutDiscovering', onPairingTimeout);

  });
};
