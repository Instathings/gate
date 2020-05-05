const _ = require('lodash');
const pjson = require('../../../package.json');

const gateVersion = pjson.version;

module.exports = function (containers) {
  const versions = {};
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
  return versions;
};
