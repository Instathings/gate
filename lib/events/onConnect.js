const debug = require('debug')('gate');

const Docker = require('dockerode');
const docker = new Docker();

module.exports = function onConnect() {
  this.sendGateLogs(docker);
  debug('Connecting...');
  debug(`Subscribing to ${this.discoverBaseTopic}/device/post`);
  debug(`Subscribing to ${this.discoverBaseTopic}/protocol/post`);
  debug(`Subscribing to ${this.discoverBaseTopic}/software/update`);
  debug(`Subscribing to ${this.discoverBaseTopic}/protocol/update`);
  debug(`Subscribing to ${this.controlBaseTopic}/+/+`);
  this.device.subscribe([
    `${this.discoverBaseTopic}/device/post`,
    `${this.discoverBaseTopic}/protocol/post`,
    `${this.discoverBaseTopic}/software/update`,
    `${this.discoverBaseTopic}/protocol/update`,
    `${this.controlBaseTopic}/+/+`,
  ], (err) => {
    if (err) {
      debug(`Error during subscribe ${err.message}`);
    }
    debug(`Subscribed to ${this.discoverBaseTopic}/device/post`);
    debug(`Subscribed to ${this.discoverBaseTopic}/protocol/post`);
    debug(`Subscribed to ${this.discoverBaseTopic}/software/update`);
    debug(`Subscribed to ${this.discoverBaseTopic}/protocol/update`);
    debug(`Subscribed to ${this.controlBaseTopic}/+/+`);
    debug('Connected');
    this.emit('gate_connected');
  });
};
