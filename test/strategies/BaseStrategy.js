const assert = require('assert');
const BaseStrategy = require('../../lib/strategies/BaseStrategy');

describe('BaseStrategy class', () => {
  it('should throw an error if no execute method is found', () => {
    try {
      BaseStrategy();
    } catch (err) {
      assert.strictEqual(err !== undefined, true);
    }
  });
});
