const debug = require('debug');
const shell = require('shelljs');
const Docker = require('dockerode');
const path = require('path');
const _ = require('lodash');
const async = require('async');

const BaseStrategy = require('./BaseStrategy');
const sendContainerLogs = require('../methods/sendContainerLogs');
const listContainers = require('./install/listContainers');
const getVersions = require('./install/getVersions');
const getInstallMessage = require('./install/getInstallMessage');
const getInstallParameters = require('./install/getInstallParameters');

const logError = debug('gate:error');
const docker = new Docker();
const basePath = path.join(__dirname, '..', '..');

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
      listBefore: listContainers,
      install: ['listBefore', (results, autoCb) => {
        const filename = path.join(basePath, 'installScripts', protocol, `${protocol}-install.sh`);
        let script = `bash ${filename}`;
        script = getInstallParameters(parameters, parametersKeys, script);
        shell.exec(script, (code, stdout, stderr) => {
          autoCb(null, code, stdout, stderr);
        });
      }],
      listAfter: ['install', listContainers],
      difference: ['listAfter', (results, autoCb) => {
        const { listBefore, listAfter } = results;
        const idsBefore = [];
        const idsAfter = [];
        listBefore.forEach((element) => {
          idsBefore.push(element.Names[0].replace('/', ''));
        });
        listAfter.forEach((element) => {
          idsAfter.push(element.Names[0].replace('/', ''));
        });
        const newContainersNames = idsAfter.filter((id) => !idsBefore.includes(id));
        const listAfterResults = {
          allContainers: listAfter,
          newContainersNames,
        };
        return autoCb(null, listAfterResults);
      }],
      versions: ['difference', (results, autoCb) => {
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
        const { newContainersNames } = results.difference;
        newContainersNames.forEach((containerId) => {
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
