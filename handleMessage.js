const initAddOn = require('./initAddOn');
const publishData = require('./publishData');
const onNewDeviceFn = require('./events/onNewDevice');

module.exports = function handleMessage(device, knownDevices) {
  return function handleMessage(topicName, payload) {
    const topicMess = JSON.parse(payload.toString());
    console.log('message', topicName, topicMess);
    const { topic } = topicMess;
    const { idIn } = topicMess;
    const { deviceType } = topicMess;
    const { addOn } = topicMess;
    const onNewDevice = onNewDeviceFn(knownDevices, idIn, topic);

    return initAddOn(addOn, knownDevices, (err, addOnInstance) => {
      addOnInstance.init();
      console.log('start discovering ble device...')
      addOnInstance.on('data', (data) => {
        return publishData(device, data, topic, (err) => {
          if (err) {
            console.log(err);
          }
        })
      });
      addOnInstance.on('newDevice', onNewDevice);
    });
  };
}
