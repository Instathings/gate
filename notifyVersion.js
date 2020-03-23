const _ = require('lodash');
const Docker = require('dockerode');

const docker = new Docker();

const pjson = require('./package.json');

module.exports = function notifyVersion(device, discoverBaseTopic) {
  const gateVersion = pjson.version;
  const versions = {};
  const message = {
    versions,
  }
  if (process.env.IS_HOST) {
    _.set(message, 'versions.gate', `instathings/gate:${gateVersion}`)
  }
  docker.listContainers((err, containers) => {
    if (err) {
      console.log(err);
    }
    containers.forEach((container) => {
      let containerName = container.Names;
      containerName = containerName[0].replace('/', '');
      _.set(versions, containerName, container.Image);
      if (containerName === 'gate') {
        let gateImage = container.Image;
        const tag = (process.env.NODE_ENV !== 'production') ? 'staging' : 'latest';
        gateImage = gateImage.replace(tag, gateVersion);
        _.set(versions, 'gate', gateImage);
      }
    });
    _.set(message, 'versions', versions);
    device.publish(`${discoverBaseTopic}/version`, JSON.stringify(message));
  });
};

