const debug = require('debug');
const async = require('async');
const BaseStrategy = require('./BaseStrategy');
const initFn = require('../addOn/functions/init');

/**
 * Events
 */
const onData = require('../addOn/events/onData');
const onNewDevice = require('../addOn/events/onNewDevice');
const onDeviceRemovedFn = require('../addOn/events/onDeviceRemoved');
const onStatus = require('../addOn/events/onStatus');
const onTimeoutDiscovering = require('../addOn/events/onTimeoutDiscovering');

const log = debug('gate:log');
log.log = console.log.bind(console);

function publishStatusUpdate() {
  const responseTopic = this.topic.replace('/post', '');
  const deviceId = this.message.idIn;
  const payload = {
    status: {
      eventType: 'discovering',
    },
    deviceId,
  };
  log(`Publishing on topic ${responseTopic}`);
  log(JSON.stringify(payload));
  this.device.publish(responseTopic, JSON.stringify(payload));
}

class PairSubdeviceStrategy extends BaseStrategy {
  execute() {
    const { deviceType, parameters } = this.message;
    const deviceId = this.message.idIn;
    const init = initFn.call(this, deviceId, deviceType, parameters);
    return async.waterfall([
      init,
      (addOnInstance, wfCb) => {
        log('Start discovering...');
        addOnInstance.init();
        publishStatusUpdate.call(this);
        return wfCb(null, addOnInstance);
      },
      (addOnInstance, wfCb) => {
        const { topic } = this.message;
        /**
         * Data event
         */
        addOnInstance.on('data', onData.bind(this.GateContext, topic));
        /**
         * Status event
         */
        addOnInstance.on('status', onStatus.bind(this.GateContext));
        /**
         * Device removed event
         */
        const onDeviceRemoved = onDeviceRemovedFn.call(this, deviceType);
        addOnInstance.once('deviceRemoved', onDeviceRemoved);
        /**
         * New device event
         */
        addOnInstance.on('newDevice', onNewDevice.bind(this));

        /**
         * Timeout discovering event
         */
        addOnInstance.on('timeoutDiscovering', onTimeoutDiscovering.bind(this));

        return wfCb();
      },
    ]);
  }
}

module.exports = PairSubdeviceStrategy;
