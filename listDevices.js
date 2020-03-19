const fs = require('fs');

const configPath = process.env.IS_HOST ? '/home/pi/service/knownDevices.config' : '/home/node/gate/service/knownDevices.config';

module.exports = function listDevices() {
  let deviceKeys = {};
  if (fs.existsSync(configPath)) {
    const stringKeys = fs.readFileSync(configPath);
    deviceKeys = JSON.parse(stringKeys);
  }
  return deviceKeys;
};
