const debug = require('debug');
const async = require('async');
const request = require('request');

const log = debug('gate:log');

function createFormData(formData, uploadOptions, bufferedBody) {
  Object.entries(uploadOptions.fields).forEach(([k, v]) => {
    formData.append(k, v);
  });
  formData.append('file', bufferedBody);
  return formData;
}

module.exports = class RequestAndUpload {
  constructor(step) {
    this.step = step;
  }

  execute(callback) {
    const { requestOptions, uploadOptions } = this.step;
    return async.waterfall([
      // shelly request
      (wfCallback) => {
        log('Starting request to', JSON.stringify({ requestOptions }));
        const shellyRequest = request(requestOptions);
        const buffers = [];
        let cbCalled = false;
        shellyRequest.on('response', (response) => {
          log(`Received ${response.statusCode}`);
          const { statusCode } = response;
          if (statusCode >= 400) {
            cbCalled = true;
            return wfCallback(`Received ${statusCode}, aborting`);
          }
        });
        shellyRequest.on('data', (data) => {
          buffers.push(data);
        });
        shellyRequest.on('end', () => {
          if (cbCalled) {
            wfCallback(null, Buffer.concat(buffers));
          }
        });
        shellyRequest.on('error', (err) => {
          cbCalled = true;
          return wfCallback(err);
        });
      },
      // s3 request
      (bufferedBody, wfCallback) => {
        const requestUploadOptions = {
          method: 'POST',
          url: uploadOptions.url,
        };
        log('Starting S3 upload request to', JSON.stringify({ requestUploadOptions }));
        const uploadRequest = request(requestUploadOptions, (uploadErr, uploadResponse) => {
          if (uploadErr) {
            log(`Got err ${uploadErr} with status code ${uploadErr.s}`);
            return wfCallback();
          }
          log(`Got response with status code ${uploadResponse.statusCode} from upload`);
          if (uploadResponse.statusCode > 300) {
            return wfCallback(`Got response with status code ${uploadResponse.statusCode} from upload`);
          }
          log(`${new Date().toISOString()} - Upload successful ${uploadResponse.statusCode} from url ${requestOptions.url} to url ${uploadOptions.url}${uploadOptions.fields.key}`);
          return wfCallback();
        });
        const formData = uploadRequest.form();
        createFormData(formData, uploadOptions, bufferedBody);
      },
    ], (err) => {
      if (err) {
        log(`Request and upload ${err}`);
      }
      return callback();
    });
  }
};
