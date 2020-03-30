const assert = require('assert');
const getConnectionOptions = require('../../lib/methods/getConnectionOptions');

describe('getConnectionOptions method', () => {
  afterEach(() => {
    process.env.REGION = undefined;
    process.env.HOST = undefined;
  });

  it('should have default eu-west-1 region', () => {
    const result = getConnectionOptions();
    assert.strictEqual(result.region, 'eu-west-1');
  });

  it('should read REGION if it\'s in env', () => {
    const region = 'us-west-1';
    process.env.REGION = region;
    const result = getConnectionOptions();
    assert.strictEqual(result.region, region);
  });

  it('should read HOST', () => {
    const host = 'mqtt://host.com';
    process.env.HOST = host;
    const result = getConnectionOptions();
    assert.strictEqual(result.host, host);
  });

  it('should read paths from context', () => {
    const keyPath = 'keyPath';
    const certPath = 'certPath';
    const caPath = 'caPath';
    const clientId = 'clientId';
    const context = {
      keyPath,
      certPath,
      caPath,
      clientId,
    };
    const result = getConnectionOptions.call(context);
    assert.strictEqual(result.keyPath, keyPath);
    assert.strictEqual(result.certPath, certPath);
    assert.strictEqual(result.caPath, caPath);
    assert.strictEqual(result.clientId, clientId);
  });
});
