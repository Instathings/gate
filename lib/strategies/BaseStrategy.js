class BaseStrategy {
  constructor(topic, message, device, knownDevices, discoverBaseTopic, GateContext) {
    if (!this.execute) {
      throw new Error('Strategy must have execute method');
    }
    this.topic = topic;
    this.message = message;
    this.device = device;
    this.knownDevices = knownDevices;
    this.discoverBaseTopic = discoverBaseTopic;
    this.GateContext = GateContext;
  }

  // eslint-disable-next-line class-methods-use-this
  get clientId() {
    return `${process.env.NODE_ENV}-${process.env.PARENT_DEVICE_ID}`;
  }

}

module.exports = BaseStrategy;
