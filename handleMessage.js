const initAddOn = require('./initAddOn');
const publishData = require('./publishData');

module.exports = function handleMessage(device) {
  return function handleMessage(topicName, payload) {
    const topicMess = JSON.parse(payload.toString());
    console.log('message', topicName, topicMess);
    const { topic } = topicMess;
    const { idIn } = topicMess;
    const { deviceType } = topicMess;
    const { addOn } = topicMess;

    return initAddOn(addOn, deviceType, (err, addOnInstance) => {
      addOnInstance.start();
      console.log('start discovering ble device...')
      // return publishData(device, topic, () => {
      //   console.log(`data published on topic ${topic}`);
      // })
      addOnInstance.on('data', (data) => {
        return publishData(device, data, topic, (err) => {
          if (err) {
            console.log(err);
          }
        })
      });
    });
  };
}
