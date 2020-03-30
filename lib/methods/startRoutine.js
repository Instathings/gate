const debug = require('debug')('gate');
const async = require('async');

const initFn = require('../addOn/functions/init');
/**
 * Events
 */
const onData = require('../addOn/events/onData');
const onStatus = require('../addOn/events/onStatus');
const onDeviceRemovedFn = require('../addOn/events/onDeviceRemoved');

module.exports = function startRoutine() {
  if (this.knownDevices === {}) {
    return;
  }
  const protocols = Object.keys(this.knownDevices);

  async.eachSeries(protocols, (protocol, protCall) => {
    const devices = this.knownDevices[protocol];
    async.eachSeries(devices, (knownDevice, deviceCall) => {
      const { deviceType, id, topic } = knownDevice;
      const init = initFn.call(this, id, deviceType);
      return init((err, addOnInstance) => {
        if (err) {
          debug(`Error during devices initialization ${err.message}`);
          throw err;
        }

        addOnInstance.start(knownDevice);
        /**
         * Data event
         */
        addOnInstance.on('data', onData.bind(this, topic));
        /**
         * Status event
         */
        addOnInstance.on('status', onStatus.bind(this));
        /**
         * Device removed event
         */
        const options = {
          removeTopic: `${this.discoverBaseTopic}/device`,
        };
        const onDeviceRemoved = onDeviceRemovedFn.call(this, deviceType, options);
        addOnInstance.once('deviceRemoved', onDeviceRemoved);
        deviceCall();
      });
    }, () => {
      protCall();
      debug(`Processed all devices of ${protocol}`);
    });
  }, () => {
    debug('Read all protocols from saved device file');
  });
};
