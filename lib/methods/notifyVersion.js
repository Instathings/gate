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
      if (containerName !== 'gate') {
        _.set(versions, containerName, image);
      }

      if (containerName === 'gate') {
        let gateImage = container.Image;
        const tag = (process.env.NODE_ENV !== 'production') ? 'staging' : 'latest';
        gateImage = gateImage.replace(tag, this.version);
        _.set(versions, 'gate', gateImage);
      }
    });

    _.set(message, 'versions', versions);
    console.log(versions);
    debug('Publishing versions...');
    this.device.publish(`${this.discoverBaseTopic}/version`, JSON.stringify(message), (error) => {
      if (error) {
        debug('Err in publishing versions');
      }
      debug('Versions successfully published');
    });
  });
};
