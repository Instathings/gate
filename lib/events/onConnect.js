const debug = require('debug')('gate');

const Docker = require('dockerode');
const docker = new Docker();

module.exports = function onConnect() {
  this.sendGateLogs(docker);
  debug('Connecting...');
  debug(`Subscribing to ${this.discoverBaseTopic}/#`);
  debug(`Subscribing to ${this.controlBaseTopic}/#`);
  this.device.subscribe([
    `${this.discoverBaseTopic}/#`,
    `${this.controlBaseTopic}/#`,
  ], (err) => {
    if (err) {
      debug(`Error during subscribe ${err.message}`);
    }
    debug(`Subscribed to topic ${this.discoverBaseTopic}/#`);
    debug(`Subscribed to topic ${this.controlBaseTopic}/#`);
    debug('Connected');
    this.emit('gate_connected');
  });
};
