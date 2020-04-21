const debug = require('debug');
const _ = require('lodash');

const log = debug('gate:log');
log.log = console.log.bind(console); // don't forget to bind to console!

class AddOnHandler {
  constructor() {
    this.instances = [];
  }

  static getInstance() {
    if (this.instance === undefined) {
      this.instance = new AddOnHandler();
    }
    return this.instance;
  }

  add(addOnInstance) {
    log(`AddOnHandler added instance ${addOnInstance.id}`);
    this.instances.push(addOnInstance);
  }

  get(id) {
    return this.instances.find((element) => element.id === id);
  }

  remove(id) {
    log(`AddOnHandler removed instance ${id}`);
    _.remove(this.instances, (element) => element.id === id);
  }
}

module.exports = AddOnHandler;
