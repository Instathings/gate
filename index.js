const configFile = `${__dirname}/config/.env`;
require('dotenv').config({ path: configFile });
const awsIot = require('aws-iot-device-sdk');
const _ = require('lodash');
const path = require('path');

const keyPath = path.join(__dirname, 'config', 'private.key');
const certPath = path.join(__dirname, 'config', 'certificate.pem');
const caPath = path.join(__dirname, 'config', 'awsRootCA1.pem');
const host = process.env.HOST;
const clientId = `${process.env.NODE_ENV}-${process.env.PARENT_DEVICE_ID}`;

const options = {
  keyPath,
  certPath,
  caPath,
  clientId,
  host,
  region: 'eu-west-1',
  //debug: true,
};
//console.log(options);
const device = awsIot.device(options);

device.on('connect', () => {
  console.log('connect online');
  console.log('cronJob start');
});

device.on('disconnect', () => {
  //cronJob.stop();
  console.log('cronJob stop');
});

device.on('error', (err) => {
  console.log(err);
});

device.on('reconnect', () => {
  //cronJob.start();
  console.log('cronJob restart');
});

