const debug = require('debug');
const _ = require('lodash');

const log = debug('gate:log');
log.log = console.log.bind(console);
const logError = debug('gate:error');

module.exports = function notifyVersion(docker) {
  const versions = {};
  const message = {
    versions,
  };
  _.set(message, 'versions.gate', `instathings/gate:${this.version}`);

  return docker.listContainers((err, containers) => {
    if (err) {
      logError(err);
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
    log('Publishing versions...');
    this.device.publish(`${this.discoverBaseTopic}/version`, JSON.stringify(message), (error) => {
      if (error) {
        logError('Err in publishing versions');
      }
      log('Versions successfully published');
    });
  });
};
