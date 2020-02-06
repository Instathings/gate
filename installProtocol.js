
const shell = require('shelljs');

module.exports = function installProtocol(topicMess) {
  const { protocol } = topicMess;
  const filename = `${__dirname}/installScripts/${protocol}/${protocol}-install.sh`;
  shell.exec(`bash ${filename}`, (code, stdout, stderr) => {
    if (code !== 0) {
      console.log(stderr);
    }
  });
};
