const debug = require('debug')('gate');

const PairSubdeviceStrategy = require('../strategies/PairSubdeviceStrategy');
const ControlStrategy = require('../strategies/ControlStrategy');
const InstallStrategy = require('../strategies/InstallStrategy');
const NoOpStrategy = require('../strategies/NoOpStrategy');

module.exports = function onMessage(topic, payload) {
  const now = new Date().toISOString();
  debug(`${now} message on topic ${topic} - ${payload.toString()}`);

  const message = JSON.parse(payload.toString());
  let strategy;
  switch (topic) {
    case `${this.discoverBaseTopic}/device/post`: {
      strategy = new PairSubdeviceStrategy(topic, message, this.device, this.knownDevices);
      break;
    }

    case `${this.discoverBaseTopic}/protocol/post`: {
      strategy = new InstallStrategy(topic, message, this.device, this.knownDevices);
      break;
    }
    default: {
      const isControl = new RegExp('.*control\/.*\/').test(topic);
      if (isControl) {
        strategy = new ControlStrategy(topic, message, this.device, this.knownDevices);
      } else {
        strategy = new NoOpStrategy();
      }
    }
      break;
  }
  strategy.execute();
};
