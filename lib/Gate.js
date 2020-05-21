const debug = require('debug');
const path = require('path');
const awsIot = require('aws-iot-device-sdk');
const { EventEmitter } = require('events');
const { MongoClient } = require('mongodb');
const pjson = require('../package.json');

const log = debug('gate:log');
log.log = console.log.bind(console); // don't forget to bind to console!

const logError = debug('gate:error');

/**
 * Events
 */
const onConnect = require('./events/onConnect');
const onGateConnected = require('./events/onGateConnected');
const onMessage = require('./events/onMessage');
/**
 * Utils
 */
const getBaseTopic = require('./utils/getBaseTopic');
/**
 * Methods
 */
const listKnownDevices = require('./methods/listKnownDevices');
const notifyVersion = require('./methods/notifyVersion');
const getConnectionOptions = require('./methods/getConnectionOptions');
const sendGateLogs = require('./methods/sendGateLogs');
const startRoutine = require('./methods/startRoutine');
const httpServer = require('./express/index');


class Gate extends EventEmitter {
  constructor(configFolder) {
    super();
    this.knownDevices = this.listKnownDevices();
    this.version = pjson.version;
    this.keyPath = path.join(__dirname, '..', configFolder, 'private.key');
    this.certPath = path.join(__dirname, '..', configFolder, 'certificate.pem');
    this.caPath = path.join(__dirname, '..', configFolder, 'awsRootCA1.pem');
    this.mongoClient = new MongoClient(process.env.MONGO_URL, { useUnifiedTopology: true });
    this.device = null;
  }

  get discoverBaseTopic() {
    return getBaseTopic('discover', this.clientId);
  }

  get controlBaseTopic() {
    return getBaseTopic('control', this.clientId);
  }

  // eslint-disable-next-line class-methods-use-this
  get clientId() {
    return `${process.env.NODE_ENV}-${process.env.PARENT_DEVICE_ID}`;
  }

  start() {
    const options = this.getConnectionOptions();
    this.device = awsIot.device(options);
    this.once('gate_connected', onGateConnected.bind(this));
    this.device.on('connect', onConnect.bind(this));
    this.device.on('error', logError);
    this.device.on('disconnect', log);
    this.device.on('reconnect', log);
    this.device.on('message', onMessage.bind(this));
  }
}

Object.assign(Gate.prototype, {
  listKnownDevices,
  notifyVersion,
  getConnectionOptions,
  sendGateLogs,
  startRoutine,
  httpServer,
});

module.exports = Gate;
