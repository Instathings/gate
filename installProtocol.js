
const shell = require('shelljs');
const publishResponse = require('./publishProtocolResponse');

module.exports = function installProtocol(device, topicMess, topicName) {
  console.log('TOPIC RESPONSE', topicName);
  const { protocol } = topicMess;
  const filename = `${__dirname}/installScripts/${protocol}/${protocol}-install.sh`;
  shell.exec(`bash ${filename}`, (code, stdout, stderr) => {
    const installResponse = {
      protocol,
      exitStatus: code,
    };
    if (code !== 0) {
      installResponse.output = stderr;
      installResponse.installationSuccess = false;
      device.publish(topicName, JSON.stringify(installResponse));
      console.log(stderr);
    }
    installResponse.output = stdout;
    installResponse.installationSuccess = true;
    device.publish(topicName, JSON.stringify(installResponse));
  });
};
