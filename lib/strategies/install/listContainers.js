const _ = require('lodash');
const Docker = require('dockerode');

const docker = new Docker();

module.exports = function listContainers(results, callback) {
  if (_.isFunction(results)) {
    // eslint-disable-next-line no-param-reassign
    callback = results;
  }
  return docker.listContainers(callback);
};
