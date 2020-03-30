const debug = require('debug')('gate');
const _ = require('lodash');

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
    debug(`AddOnHandler added instance ${addOnInstance.id}`);
    this.instances.push(addOnInstance);
  }

  get(id) {
    return this.instances.find((element) => element.id === id);
  }

  remove(id) {
    debug(`AddOnHandler removed instance ${id}`);
    _.remove(this.instances, (element) => element.id === id);
  }
}

module.exports = AddOnHandler;
