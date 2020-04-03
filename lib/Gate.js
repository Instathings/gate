const debug = require('debug')('gate');

const path = require('path');
const awsIot = require('aws-iot-device-sdk');
const { EventEmitter } = require('events');
const pjson = require('../package.json');


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
const startRoutine = require('./methods/startRoutine');

class Gate extends EventEmitter {
  constructor(configFolder) {
    super();
    this.knownDevices = this.listKnownDevices();
    this.version = pjson.version;
    this.keyPath = path.join(__dirname, '..', configFolder, 'private.key');
    this.certPath = path.join(__dirname, '..', configFolder, 'certificate.pem');
    this.caPath = path.join(__dirname, '..', configFolder, 'awsRootCA1.pem');
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
    this.device.on('error', debug);
    this.device.on('disconnect', debug);
    this.device.on('error', debug);
    this.device.on('reconnect', debug);
    this.device.on('message', onMessage.bind(this));
  }
}

Object.assign(Gate.prototype, {
  listKnownDevices,
  notifyVersion,
  getConnectionOptions,
  startRoutine,
});

module.exports = Gate;
