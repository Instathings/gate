const shell = require('shelljs');

module.exports = function installProtocol(topic, protocol, protocolId, device) {
  const filename = `${__dirname}/installScripts/${protocol}/${protocol}-install.sh`;
  shell.exec(`bash ${filename}`, (code, stdout, stderr) => {
    const installResponse = {
      dt_install: new Date().getTime(),
      protocol,
      protocolId,
      exitStatus: code,
      installationSuccess: code === 0,
      stdout,
      stderr,
    };
    const responseTopic = topic.replace('/post', '');
    device.publish(responseTopic, JSON.stringify(installResponse));
  });
};
