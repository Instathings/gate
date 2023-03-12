const debug = require('debug');
const axios = require('axios').default;
const FormData = require('form-data');

const log = debug('gate:log');

function createFormData(uploadOptions, bufferedResponseBody) {
  const formData = new FormData();
  Object.entries(uploadOptions.fields).forEach(([k, v]) => {
    formData.append(k, v);
  });
  formData.append('file', bufferedResponseBody);
  return formData;
}

module.exports = class RequestAndUpload {
  constructor(step) {
    this.step = step;
  }

  execute(callback) {
    const { requestOptions, uploadOptions } = this.step;
    log(`Starting request to ${requestOptions.url}`);
    axios(requestOptions).then((response) => {
      log(`Received response with status code ${response.status}`);
      if (response.status > 300) {
        log(`Received ${response.status} from ${JSON.stringify(requestOptions)}`);
        return callback();
      }
      const formData = createFormData(uploadOptions, response.data);
      log(`Starting request to ${uploadOptions.url}`);
      axios.post(uploadOptions.url, formData, formData.getHeaders()).then((uploadResponse) => {
        log(`Received response with status code ${uploadResponse.status}`);
        log(`${new Date().toISOString()} - Upload successful from url ${requestOptions.url} to url ${uploadOptions.url}${uploadOptions.fields.key}`);
        return callback();
      }).catch((error) => {
        log(error);
        return callback();
      });
    }).catch((err) => {
      log(err);
      callback();
    });
  }
};
