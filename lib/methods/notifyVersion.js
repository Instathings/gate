const debug = require('debug')('gate');
const _ = require('lodash');

module.exports = function notifyVersion(docker) {
  const versions = {};
  const message = {
    versions,
  };
  if (process.env.IS_HOST === 'true') {
    _.set(message, 'versions.gate', `instathings/gate:${this.version}`);
  }
  return docker.listContainers((err, containers) => {
    if (err) {
      debug(err);
    }
    containers.forEach((container) => {
      const containerName = container.Names;
      const image = container.Image;
      const index = image.lastIndexOf(':');
      const key = image.substring(index);
      if (containerName !== 'gate') {
        _.set(versions, key, image);
      }

      if (containerName === 'gate') {
        let gateImage = container.Image;
        const tag = (process.env.NODE_ENV !== 'production') ? 'staging' : 'latest';
        gateImage = gateImage.replace(tag, this.version);
        _.set(versions, 'instathings/gate', gateImage);
      }
    });

    _.set(message, 'versions', versions);
    debug('Publishing versions...');
    this.device.publish(`${this.discoverBaseTopic}/version`, JSON.stringify(message), (error) => {
      if (error) {
        debug('Err in publishing versions');
      }
      debug('Versions successfully published');
    });
  });
};
