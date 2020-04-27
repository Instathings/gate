const debug = require('debug');
const shell = require('shelljs');
const Docker = require('dockerode');
const path = require('path');
const _ = require('lodash');
const async = require('async');
const pjson = require('../../package.json');
const BaseStrategy = require('./BaseStrategy');

const logError = debug('gate:error');

const docker = new Docker();
const gateVersion = pjson.version;
const basePath = path.join(__dirname, '..', '..');

function getVersions(containers) {
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
}

function getInstallMessage(protocol, protocolId, autoResults) {
  const { install, versions } = autoResults;
  const code = install[0];
  const stdout = install[1];
  const stderr = install[2];
  return {
    dt_install: new Date().getTime(),
    protocol,
    protocolId,
    exitStatus: code,
    installationSuccess: code === 0,
    stdout,
    stderr,
    versions,
  };
}

function getInstallParameters(parameters, parametersKeys, script) {
  if (!parametersKeys) {
    return script;
  }
  parametersKeys.forEach((key) => {
    const parameterKey = key.id;
    const parameter = parameters[parameterKey];
    script += ` ${parameter}`;
  });
  return script;
}

class InstallStrategy extends BaseStrategy {
  execute() {
    const { protocolRecord, parameters } = this.message;
    const protocolId = protocolRecord.id;
    const protocol = protocolRecord.slug;
    const parametersKeys = protocolRecord.parameters;

    return async.auto({
      install: (autoCb) => {
        const filename = path.join(basePath, 'installScripts', protocol, `${protocol}-install.sh`);
        let script = `bash ${filename}`;
        script = getInstallParameters(parameters, parametersKeys, script);
        shell.exec(script, (code, stdout, stderr) => {
          autoCb(null, code, stdout, stderr);
        });
      },
      versions: ['install', (results, autoCb) => {
        docker.listContainers((err, containers) => {
          if (err) {
            return autoCb(err);
          }
          const versions = getVersions(containers);
          return autoCb(null, versions);
        });
      }],
      publish: ['versions', (results, autoCb) => {
        const installResponse = getInstallMessage(protocol, protocolId, results);
        const responseTopic = this.topic.replace('/post', '');
        this.device.publish(responseTopic, JSON.stringify(installResponse));
        return autoCb();
      }],
    }, (err) => {
      if (err) {
        logError(err);
      }
    });
  }
}

module.exports = InstallStrategy;
