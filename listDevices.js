const fs = require('fs');

const configPath = `${__dirname}/knownDevices.config`;

module.exports = function listDevices() {
  let deviceKeys = {};
  if (fs.existsSync(configPath)) {
    const stringKeys = fs.readFileSync(configPath);
    deviceKeys = JSON.parse(stringKeys);
  }
  return deviceKeys;
};
