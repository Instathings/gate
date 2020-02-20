const debug = require('debug')('gate');
const awsIot = require('aws-iot-device-sdk');
const path = require('path');
const dotenv = require('dotenv');
const handleMessageFn = require('./handleMessage');

const configFile = `${__dirname}/config/.env`;
dotenv.config({ path: configFile });

const listDevices = require('./listDevices');
const startRoutine = require('./startRoutine');

const keyPath = path.join(__dirname, 'config', 'private.key');
const certPath = path.join(__dirname, 'config', 'certificate.pem');
const caPath = path.join(__dirname, 'config', 'awsRootCA1.pem');
const host = process.env.HOST;

function getBaseTopic(prefix, clientId) {
  let topic = `${prefix}/${process.env.PROJECT_ID}/${clientId}`;
  if (process.env.NODE_ENV !== 'production') {
    topic = `${process.env.NODE_ENV}-${topic}`;
  }
  return topic;
}

const clientId = `${process.env.NODE_ENV}-${process.env.PARENT_DEVICE_ID}`;
const discoverBaseTopic = getBaseTopic('discover', clientId);
const controlBaseTopic = getBaseTopic('control', clientId);

const options = {
  keyPath,
  certPath,
  caPath,
  clientId,
  host,
  region: 'eu-west-1',
};

const device = awsIot.device(options);
const knownDevices = listDevices();

device.on('connect', () => {
  debug('Connected');
  debug(`Subscribing to ${discoverBaseTopic}/#`);
  debug(`Subscribing to ${controlBaseTopic}/#`);
  device.subscribe([
    `${discoverBaseTopic}/#`,
    `${controlBaseTopic}/#`,
  ], (err) => {
    if (err) {
      debug(`Error during subscribe ${err.message}`);
    }
    debug(`Subscribed to topic ${discoverBaseTopic}/#`);
    debug(`Subscribed to topic ${controlBaseTopic}/#`);
  });
  debug(`Subscribing to ${controlBaseTopic}/#`);
  startRoutine(device, knownDevices);
});

device.on('disconnect', () => {
  debug('Disconnected');
});

device.on('error', (err) => {
  debug('Error', err);
});

device.on('reconnect', () => {
  debug('Reconnect');
});

const handleMessage = handleMessageFn(device, knownDevices, discoverBaseTopic, controlBaseTopic);
device.on('message', handleMessage);
