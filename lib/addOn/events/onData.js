const debug = require('debug');

const saveToMongo = require('../../utils/saveToMongo');

const log = debug('gate:log');
log.log = console.log.bind(console);
const logError = debug('gate:error');

module.exports = async function onData(topic, data) {
  if (process.env.CLOUD_ENABLED === undefined || process.env.CLOUD_ENABLED === true) {
    log(`Publish data on ${topic}`);
    log(JSON.stringify(data));
    this.device.publish(topic, JSON.stringify(data));
  }
  if (process.env.ON_PREMISE_ENABLED) {
    const deviceId = topic.split('/')[3];
    try {
      const ts = new Date();
      const dataEvent = {
        payload: data,
        deviceId,
        ts,
      };
      const deviceEvent = {
        action: 'data',
        payload: data,
        ts,
      };
      await saveToMongo.call(this, dataEvent);
      this.io.emit('data', dataEvent);
      this.io.emit(`${deviceId}`, deviceEvent);
      this.io.emit(`data_${deviceId}`, data);
    } catch (error) {
      logError(error);
    }
  }
};
