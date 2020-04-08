const assert = require('assert');
const notifyVersion = require('../../lib/methods/notifyVersion');

const discoverBaseTopic = 'discover';
const version = '1.0.1';
const id = `instathings/gate:${version}`;

describe('Notify version', () => {
  it('should publish correct gate version', (done) => {
    const context = {
      version,
      discoverBaseTopic,
      device: {
        publish: (topic, body, callback) => {
          assert.strictEqual(topic, `${discoverBaseTopic}/version`);
          const expected = {
            versions: {
              gate: id,
            },
          };
          const expectedStringified = JSON.stringify(expected);
          assert.strictEqual(body, expectedStringified);
          callback();
          done();
        },
      },
    };
    const docker = {
      listContainers: (callback) => {
        const result = [
          {
            Names: ['/gate'],
            Image: id,
          },
        ];
        return callback(null, result);
      },
    };
    notifyVersion.call(context, docker);
  });

  it('should report additional containers', (done) => {
    const context = {
      version,
      discoverBaseTopic,
      device: {
        publish: (topic, body, callback) => {
          assert.strictEqual(topic, `${discoverBaseTopic}/version`);
          const expected = {
            versions: {
              gate: id,
              'koenkk-zigbee2mqtt': 'koenkk/zigbee2mqtt:1.11.0',
              'eclipse-mosquitto': 'eclipse-mosquitto:1.6.8',
            },
          };
          const expectedStringified = JSON.stringify(expected);
          assert.strictEqual(body, expectedStringified);
          callback();
          done();
        },
      },
    };
    const docker = {
      listContainers: (callback) => {
        const result = [
          {
            Names: ['/gate'],
            Image: id,
          },
          {
            Names: ['/koenkk-zigbee2mqtt'],
            Image: 'koenkk/zigbee2mqtt:1.11.0',
          },
          {
            Names: ['/eclipse-mosquitto'],
            Image: 'eclipse-mosquitto:1.6.8',
          },
        ];
        return callback(null, result);
      },
    };
    notifyVersion.call(context, docker);
  });
});
