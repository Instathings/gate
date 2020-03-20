const shell = require('shelljs');
const Docker = require('dockerode');
const _ = require('lodash');
const pjson = require('./package.json');

const docker = new Docker();
const gateVersion = pjson.version;


module.exports = function installProtocol(topic, protocol, protocolId, device) {
  const versions = {};
  const filename = `${__dirname}/installScripts/${protocol}/${protocol}-install.sh`;
  const script = `bash ${filename}`;
  shell.exec(script, (code, stdout, stderr) => {
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
      const installResponse = {
        dt_install: new Date().getTime(),
        protocol,
        protocolId,
        exitStatus: code,
        installationSuccess: code === 0,
        stdout,
        stderr,
        versions,
      };
      const responseTopic = topic.replace('/post', '');
      device.publish(responseTopic, JSON.stringify(installResponse));
    });
  });
};
