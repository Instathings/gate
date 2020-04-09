const containerLogs = require('../utils/containerLogs');
module.exports = function sendGateLogs(docker) {
  const gateContainer = docker.getContainer('gate');
  containerLogs.call(this, gateContainer);
};