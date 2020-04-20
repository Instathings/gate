const debug = require('debug')('gate');
const shell = require('shelljs');
const Docker = require('dockerode');
const async = require('async');

const BaseStrategy = require('./BaseStrategy');

const docker = new Docker();

function getContainerNameFromSlug(slug) {
  return slug.replace('/', '-');
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
        debug(err);
        return err;
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
          const cmd = `docker run -dt ${portMapping} ${mountOptions} --name ${containerName} --network ${networkName} --restart=always ${id}`;
          executeUpgrade(cmd, oldSlug, id, container);
          break;
        }

        default:
          break;
      }
    }, callback);
  }
}

module.exports = UpdateProtocolStrategy;
