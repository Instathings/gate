const debug = require('debug')('gate');
const _ = require('lodash');
const awsIot = require('aws-iot-device-sdk');
const path = require('path');
const dotenv = require('dotenv');
const handleMessage = require('./handleMessage');

const configFile = `${__dirname}/config/.env`;
dotenv.config({ path: configFile });

const keyPath = path.join(__dirname, 'config', 'private.key');
const certPath = path.join(__dirname, 'config', 'certificate.pem');
const caPath = path.join(__dirname, 'config', 'awsRootCA1.pem');
const host = process.env.HOST;

const clientId = `${process.env.NODE_ENV}-${process.env.PARENT_DEVICE_ID}`;
const discoverTopic = `${process.env.NODE_ENV}-discover/${process.env.PROJECT_ID}/${clientId}`;
const options = {
  keyPath,
  certPath,
  caPath,
  clientId,
  host,
  region: 'eu-west-1',
};

if (process.env.DEBUG === 'gate') {
  _.set(options, 'debug', true);
}

const device = awsIot.device(options);

device.on('connect', () => {
  debug('Connected');
  device.subscribe(discoverTopic, (err, granted) => {
    debug(err, granted, 'subscribe ok');
  });
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

device.on('message', handleMessage);
