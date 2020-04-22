const debug = require('debug');
const Docker = require('dockerode');

const PairSubdeviceStrategy = require('../strategies/PairSubdeviceStrategy');
const ControlStrategy = require('../strategies/ControlStrategy');
const InstallStrategy = require('../strategies/InstallStrategy');
const NoOpStrategy = require('../strategies/NoOpStrategy');
const UpdateSoftwareStrategy = require('../strategies/UpdateSoftwareStrategy');
const UpdateProtocolStrategy = require('../strategies/UpdateProtocolStrategy');

const docker = new Docker();
const log = debug('gate:log');
log.log = console.log.bind(console);
const logError = debug('gate:error');

module.exports = function onMessage(topic, payload) {
  const now = new Date().toISOString();
  log(`${now} message on topic ${topic} - ${payload.toString()}`);

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

    case `${this.discoverBaseTopic}/software/update`: {
      strategy = new UpdateSoftwareStrategy(topic, message, this.device, this.knownDevices);
      return strategy.execute((err) => {
        /**
         * If something goes wrong at least notify old versions
         */
        if (err) {
          this.notifyVersion(docker);
        }
      });
      break;
    }

    case `${this.discoverBaseTopic}/protocol/update`: {
      strategy = new UpdateProtocolStrategy(topic, message, this.device, this.knownDevices);
      return strategy.execute((err) => {
        /**
         * If something goes wrong at least notify old versions
         */
        if (err) {
          logError(err);
        }
        setTimeout(() => {
          this.notifyVersion(docker);
        }, 10000);
      });
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
  return strategy.execute();
};
