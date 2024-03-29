const debug = require('debug');
const Docker = require('dockerode');

const log = debug('gate:log');
log.log = console.log.bind(console);
const logError = debug('gate:error');

const docker = new Docker();

module.exports = async function onConnect() {
  this.sendGateLogs(docker);
  if (process.env.ON_PREMISE_ENABLED) {
    await this.mongoClient.connect();
    log('Connected to MongoDb');
    this.httpServer();
  }
  log('Connecting...');
  log(`Subscribing to ${this.discoverBaseTopic}/device/post`);
  log(`Subscribing to ${this.discoverBaseTopic}/protocol/post`);
  log(`Subscribing to ${this.discoverBaseTopic}/software/update`);
  log(`Subscribing to ${this.discoverBaseTopic}/protocol/update`);
  log(`Subscribing to ${this.controlBaseTopic}/+/+`);
  this.device.subscribe([
    `${this.discoverBaseTopic}/device/post`,
    `${this.discoverBaseTopic}/protocol/post`,
    `${this.discoverBaseTopic}/software/update`,
    `${this.discoverBaseTopic}/protocol/update`,
    `${this.controlBaseTopic}/+/+`,
  ], (err) => {
    if (err) {
      logError(`Error during subscribe ${err.message}`);
      throw err;
    }
    log(`Subscribed to ${this.discoverBaseTopic}/device/post`);
    log(`Subscribed to ${this.discoverBaseTopic}/protocol/post`);
    log(`Subscribed to ${this.discoverBaseTopic}/software/update`);
    log(`Subscribed to ${this.discoverBaseTopic}/protocol/update`);
    log(`Subscribed to ${this.controlBaseTopic}/+/+`);
    log('Connected');
    this.emit('gate_connected');
  });
};
