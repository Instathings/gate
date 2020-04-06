const Docker = require('dockerode');

const docker = new Docker();

module.exports = function onGateConnected() {
  this.notifyVersion(docker);
  this.startRoutine();
};
