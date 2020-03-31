const debug = require('debug')('gate');
const Docker = require('dockerode');
const _ = require('lodash');

const docker = new Docker();

module.exports = function notifyVersion() {
  const versions = {};
  const message = {
    versions,
  };
  if (process.env.IS_HOST === 'true') {
    _.set(message, 'versions.gate', `instathings/gate:${this.version}`);
  }
  docker.listContainers((err, containers) => {
    if (err) {
      debug(err);
    }
    containers.forEach((container) => {
      let containerName = container.Names;
      containerName = containerName[0].replace('/', '');
      _.set(versions, containerName, container.Image);
      if (containerName === 'gate') {
        let gateImage = container.Image;
        const tag = (process.env.NODE_ENV !== 'production') ? 'staging' : 'latest';
        gateImage = gateImage.replace(tag, this.version);
        _.set(versions, 'gate', gateImage);
      }
    });
    _.set(message, 'versions', versions);
    debug('Publishing versions...');
    this.device.publish(`${this.discoverBaseTopic}/version`, JSON.stringify(message), (err) => {
      if (err) {
        debug('Err in publishing versions');
      }
      debug('Versions successfully published');
    });
  });
};
