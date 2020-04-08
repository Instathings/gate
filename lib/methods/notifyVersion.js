const debug = require('debug')('gate');
const _ = require('lodash');

module.exports = function notifyVersion(docker) {
  const versions = {};
  const message = {
    versions,
  };
  _.set(message, 'versions.gate', `instathings/gate:${this.version}`);

  return docker.listContainers((err, containers) => {
    if (err) {
      debug(err);
    }
    containers.forEach((container) => {
      let containerName = container.Names;
      containerName = containerName[0].replace('/', '');

      const image = container.Image;
      if (containerName !== 'gate') {
        _.set(versions, containerName, image);
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
