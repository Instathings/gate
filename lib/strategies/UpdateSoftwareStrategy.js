const debug = require('debug')('gate');
const shell = require('shelljs');
const Docker = require('dockerode');
const _ = require('lodash');
const async = require('async');
const BaseStrategy = require('./BaseStrategy');

const docker = new Docker();

class InstallStrategy extends BaseStrategy {
  execute() {
    console.log(this);
    return async.auto({
      upgrade: (autoCb) => {
        const { newSoftwareId } = this.message;
        const index = newSoftwareId.indexOf(':');
        const version = newSoftwareId.substring(index + 1);
        const cmd = `git fetch && git checkout ${version}`;
        shell.exec(cmd, (err, stdout, stderr) => {
          console.log(err, stdout, stderr);
          if (err) {
            return autoCb(err);
          }
          return autoCb();
        });
      },
      restart: ['upgrade', (results, autoCb) => {
        const container = docker.getContainer('gate').restart();
      }],
    }, () => {
      debug('UPGRADE SUCCESSFULL');
    });
  }
}

module.exports = InstallStrategy;
