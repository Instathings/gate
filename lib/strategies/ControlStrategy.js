const async = require('async');
const request = require('request');
const debug = require('debug');
const _ = require('lodash');
const BaseStrategy = require('./BaseStrategy');
const AddOnHandler = require('../AddOnHandler');

const log = debug('gate:log');
log.log = console.log.bind(console);

class ControlStrategy extends BaseStrategy {
  execute() {
    const { type } = this.message;
    if (type) {
      switch (type) {
        case 'CUSTOM_BEHAVIOUR': {
          log('Custom behaviour ', type);
          const { steps } = this.message;
          async.eachSeries(steps, (step, callback) => {
            const { action } = step;
            switch (action) {
              case 'ACTION_REQUEST_AND_UPLOAD': {
                const { requestOptions, uploadOptions } = step;
                const dataRequest = request(requestOptions);
                const uploadRequest = request({
                  method: 'post',
                  url: uploadOptions.url,
                });
                const formData = uploadRequest.form();
                formData.append('Content-Type', 'text/csv');
                Object.entries(uploadOptions.fields).forEach(([k, v]) => {
                  log('APPEND', k, v);
                  formData.append(k, v);
                });
                formData.append('file', dataRequest);
                uploadRequest.on('data', (d) => { log(d); });
                uploadRequest.on('response', (response) => {
                  log(response.statusCode);
                  callback();
                });
                break;
              }
              default: {
                callback();
                break;
              }
            }
          }, (err) => {

          });
          break;
        }
        default: {
          log(`Received message with type ${type} that I can't handle`);
        }
      }
      return;
    }
    const splitted = this.topic.split('/');
    const deviceId = _.get(splitted, '[3]');
    const addOnHandler = AddOnHandler.getInstance();
    const addOnInstance = addOnHandler.get(deviceId);
    if (!addOnInstance) {
      log(`No instance with id ${deviceId} found, skipping`);
      return;
    }

    const action = splitted[splitted.length - 1];
    addOnInstance.control(this.message, action);
    if (action === 'remove') {
      addOnInstance.remove(this.message);
    }
  }
}

module.exports = ControlStrategy;
