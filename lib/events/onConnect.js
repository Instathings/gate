const debug = require('debug')('gate');

module.exports = function onConnect() {
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
