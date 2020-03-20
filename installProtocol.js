const shell = require('shelljs');
const Docker = require('dockerode');
const _ = require('lodash');
const pjson = require('./package.json');

const docker = new Docker();
const gatewayVersion = {};
const gateVersion = pjson.version;


module.exports = function installProtocol(topic, protocol, protocolId, device) {
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
        _.set(gatewayVersion, `${containerName}`, container.Image);
        if (containerName === 'gate') {
          let gateImage = container.Image;
          gateImage = gateImage.replace('latest', gateVersion);
          _.set(gatewayVersion, 'gate', gateImage);
        }
      });
    });
    const installResponse = {
      dt_install: new Date().getTime(),
      protocol,
      protocolId,
      exitStatus: code,
      installationSuccess: code === 0,
      stdout,
      stderr,
      gateVersion,
    };
    const responseTopic = topic.replace('/post', '');
    device.publish(responseTopic, JSON.stringify(installResponse));
  });
};
