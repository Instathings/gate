const debug = require('debug');
const _ = require('lodash');
const BaseStrategy = require('./BaseStrategy');
const AddOnHandler = require('../AddOnHandler');

const log = debug('gate:log');
log.log = console.log.bind(console);

class ControlStrategy extends BaseStrategy {
  execute() {
    const splitted = this.topic.split('/');
    const deviceId = _.get(splitted, '[3]');
    const addOnHandler = AddOnHandler.getInstance();
    const addOnInstance = addOnHandler.get(deviceId);
    if (!addOnInstance) {
      log(`No instance with id ${deviceId} found, skipping`);
      return;
    }

    const action = splitted[splitted.length - 1];
    addOnInstance.control(this.message, action);
    if (action === 'remove') {
      addOnInstance.remove(this.message);
    }
  }
}

module.exports = ControlStrategy;
