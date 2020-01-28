const initAddOn = require('./initAddOn');

module.exports = function handleMessage(topicName, payload) {
  const topicMess = JSON.parse(payload.toString());
  console.log('message', topicName, topicMess);
  const { topic } = topicMess;
  const { idIn } = topicMess;
  const { deviceType } = topicMess;
  const { addOn } = topicMess;

  return initAddOn(addOn, deviceType);
};
