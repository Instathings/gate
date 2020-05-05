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

const sendContainerLogs = require('../methods/sendContainerLogs');

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
  if (!parametersKeys && !parameters) {
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
  constructor(topic, message, device, knownDevices, discoverBaseTopic) {
    super(topic, message, device, knownDevices);
    this.discoverBaseTopic = discoverBaseTopic;
  }
  execute() {
    const { protocolRecord } = this.message;
    const protocolId = protocolRecord.id;
    const protocol = protocolRecord.slug;
    const parameters = _.get(this.message, 'parameters');
    const parametersKeys = _.get(protocolRecord, 'parameters');

    return async.auto({
      listBefore: (autoCb) => {
        docker.listContainers((err, containers) => {
          if (err) {
            return autoCb(err);
          }
          return autoCb(null, containers);
        });
      },
      install: ['listBefore', (results, autoCb) => {
        const filename = path.join(basePath, 'installScripts', protocol, `${protocol}-install.sh`);
        let script = `bash ${filename}`;
        script = getInstallParameters(parameters, parametersKeys, script);
        shell.exec(script, (code, stdout, stderr) => {
          autoCb(null, code, stdout, stderr);
        });
      }],
      listAfter: ['install', (results, autoCb) => {
        docker.listContainers((err, containers) => {
          if (err) {
            return autoCb(err);
          }
          return autoCb(null, containers);
        });
      }],
      versions: ['listAfter', (results, autoCb) => {
        const containers = results.listAfter;
        const versions = getVersions(containers);
        return autoCb(null, versions);
      }],
      publish: ['versions', (results, autoCb) => {
        const installResponse = getInstallMessage(protocol, protocolId, results);
        const responseTopic = this.topic.replace('/post', '');
        this.device.publish(responseTopic, JSON.stringify(installResponse));
        return autoCb();
      }],
      logs: ['publish', (results, autoCb) => {
        const { listBefore, listAfter } = results;
        const idsBefore = []; const idsAfter = []
        listBefore.map((element) => { idsBefore.push(element.Names[0].replace('/', '')); });
        listAfter.map((element) => { idsAfter.push(element.Names[0].replace('/', '')); });
        console.log('BEFORE', listBefore);
        const newContainers = idsAfter.filter(x => !idsBefore.includes(x));
        console.log('NEW', newContainers);
        newContainers.forEach(containerId => {
          sendContainerLogs(this.device, this.discoverBaseTopic, containerId, docker);
        });
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
