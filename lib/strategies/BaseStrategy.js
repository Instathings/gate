class BaseStrategy {
  constructor(topic, message, device, knownDevices) {
    if (!this.execute) {
      throw new Error('Strategy must have execute method');
    }
    this.topic = topic;
    this.message = message;
    this.device = device;
    this.knownDevices = knownDevices;
  }
}

module.exports = BaseStrategy;
