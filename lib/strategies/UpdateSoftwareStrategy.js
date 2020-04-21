const shell = require('shelljs');
const Docker = require('dockerode');
const async = require('async');

const BaseStrategy = require('./BaseStrategy');

const docker = new Docker();

class InstallStrategy extends BaseStrategy {
  execute(callback) {
    return async.auto({
      upgrade: (autoCb) => {
        const { newSoftwareId } = this.message;
        const index = newSoftwareId.indexOf(':');
        const version = newSoftwareId.substring(index + 1);
        const cmd = `git fetch && git checkout v${version}`;
        shell.exec(cmd, (code, stdout, stderr) => {
          const isError = code !== 0;
          if (isError) {
            const error = new Error(`Error during update ${stderr}\n${stdout}`);
            return autoCb(error);
          }
          return autoCb();
        });
      },
      restart: ['upgrade', (results, autoCb) => {
        docker.getContainer('gate').restart().then(autoCb).catch(autoCb);
      }],
    }, callback);
  }
}

module.exports = InstallStrategy;
