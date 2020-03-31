const assert = require('assert');
const NoOpStrategy = require('../../lib/strategies/NoOpStrategy');

describe('NoOpStrategy class', () => {
  it('should set parameters as class instance properties', () => {
    const topic = 'topic';
    const message = 'message';
    const device = 'device';
    const knownDevices = 'knownDevices';
    const baseStrategy = new NoOpStrategy(topic, message, device, knownDevices);
    assert.strictEqual(baseStrategy.topic, topic);
    assert.strictEqual(baseStrategy.message, message);
    assert.strictEqual(baseStrategy.device, device);
    assert.strictEqual(baseStrategy.knownDevices, knownDevices);
  });

  it('should have the execute method', () => {
    const baseStrategy = new NoOpStrategy();
    assert.strictEqual(baseStrategy.execute !== undefined, true);
  });
});
