const BaseStrategy = require('./BaseStrategy');

class NoOpStrategy extends BaseStrategy {
  // eslint-disable-next-line class-methods-use-this
  execute() { }
}

module.exports = NoOpStrategy;
