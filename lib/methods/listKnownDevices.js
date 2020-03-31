const fs = require('fs');
const path = require('path');

const HOST_PATH = path.join(__dirname, '..', '..', 'knownDevices.config');
const DOCKER_PATH = '/home/node/gate/service/knownDevices.config';


module.exports = function listDevices() {
  let configPath = DOCKER_PATH;
  if (process.env.IS_HOST === 'true') {
    configPath = HOST_PATH;
  }
  let deviceKeys = {};
  if (fs.existsSync(configPath)) {
    const stringKeys = fs.readFileSync(configPath);
    deviceKeys = JSON.parse(stringKeys);
  }
  return deviceKeys;
};
