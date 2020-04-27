const debug = require('debug');
const shell = require('shelljs');
const Docker = require('dockerode');
const async = require('async');
const _ = require('lodash');

const BaseStrategy = require('./BaseStrategy');

const docker = new Docker();
const logError = debug('gate:error');

function getContainerNameFromSlug(slug) {
  return slug.replace('/', '-');
}

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


function executeUpgrade(cmd, oldSlug, id, container) {
  shell.exec(cmd, async (code, stdout, stderr) => {
    const isError = code !== 0;
    if (isError) {
      const error = new Error(`Error during update ${stderr}\n${stdout}`);
      const optionsErr = {
        id: oldSlug,
        name: id,
      };
      await container.rename(optionsErr);
      await container.start();
      return error;
    }
    const oldContainer = await docker.getContainer(oldSlug);
    await oldContainer.remove();
    return null;
  });
}

function getInstallMessage(protocolId, versions) {
  return {
    dt_install: new Date().getTime(),
    protocol: '',
    protocolId,
    exitStatus: 0,
    installationSuccess: true,
    stdout: '',
    stderr: '',
    versions,
  };
}

class UpdateProtocolStrategy extends BaseStrategy {
  execute(callback) {
    const networkName = 'gate-net';
    async.eachSeries(this.message, async (software) => {
      const { id, slug } = software;
      const containerName = getContainerNameFromSlug(slug);
      const oldSlug = `${containerName}-old`;

      let inspect;
      let container;
      try {
        container = await docker.getContainer(containerName);
        inspect = await container.inspect();
        await container.stop();
        const renameOptions = {
          id: slug,
          name: oldSlug,
        };
        await container.rename(renameOptions);
      } catch (err) {
        logError(err);
        throw err;
      }
      const mounts = inspect.Mounts;
      let mountOptions = '';
      mounts.forEach((mount) => {
        mountOptions += `-v ${mount.Source}:${mount.Destination} `;
      });
      let portMapping = '';
      switch (slug) {
        case 'eclipse-mosquitto': {
          portMapping = '-p 1883:1883 -p 9001:9001';
          const cmd = `docker run -dt ${portMapping} ${mountOptions} --name ${containerName} --network ${networkName} --restart=always ${id}`;
          executeUpgrade(cmd, oldSlug, id, container);
          break;
        }
        case 'instathings/modbus2mqtt': {
          const additionalOptions = '--device=/dev/ttyUSB0 -e TZ=GMT --privileged=true';
          const cmd = `docker run -dt ${portMapping} ${additionalOptions} ${mountOptions} --name ${containerName} --network ${networkName} --restart=always ${id}`;
          executeUpgrade(cmd, oldSlug, id, container);
          break;
        }

        case 'koenkk/zigbee2mqtt': {
          const additionalOptions = '--device=/dev/ttyACM0 -e TZ=GMT --privileged=true';
          const cmd = `docker run -dt ${portMapping} ${additionalOptions} ${mountOptions} --name ${containerName} --network ${networkName} --restart=always ${id}`;
          executeUpgrade(cmd, oldSlug, id, container);
          break;
        }

        case 'nodered/node-red': {
          portMapping = '-p 1880:1880';
          const cmd = `docker run -dt ${portMapping} ${mountOptions} --name ${containerName} --network ${networkName} --restart=always ${id}`;
          executeUpgrade(cmd, oldSlug, id, container);
          break;
        }

        default:
          break;
      }
    }, (err) => {
      if (err) {
        return callback(err);
      }
      async.auto({
        versions: [(autoCb) => {
          docker.listContainers((err, containers) => {
            if (err) {
              return autoCb(err);
            }
            const versions = getVersions(containers);
            return autoCb(null, versions);
          });
        }],
        publish: ['versions', (results, autoCb) => {
          const versions = results.versions;
          const protocolId = this.message[0].protocol;
          const installResponse = getInstallMessage(protocolId, versions);
          const responseTopic = this.topic.replace('/update', '');
          this.device.publish(responseTopic, JSON.stringify(installResponse));
          return autoCb();
        }]
      })
    });
  }
}

module.exports = UpdateProtocolStrategy;
