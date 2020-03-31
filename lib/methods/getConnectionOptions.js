module.exports = function getConnectionOptions() {
  return {
    keyPath: this.keyPath,
    certPath: this.certPath,
    caPath: this.caPath,
    clientId: this.clientId,
    host: process.env.HOST,
    region: process.env.REGION || 'eu-west-1',
  };
};
