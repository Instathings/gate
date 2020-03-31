module.exports = function onGateConnected() {
  this.notifyVersion();
  this.startRoutine();
};
