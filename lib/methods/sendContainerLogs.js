const debug = require('debug');
const logError = debug('gate:error');

function onDataLogFn(type, logs, chunk) {
  const logEntry = {
    message: `[${type}] ${chunk.toString()}`,
    timestamp: new Date().getTime(),
  };
  logs.push(logEntry);
}

module.exports = function sendContainerLogs(docker) {
  const container = docker.getContainer('instathings-knx2mqtt');

  const logsOp = {
    follow: true,
    stdout: true,
    stderr: true,
    since: new Date().getTime() / 1000,
  };

  return container.logs(logsOp, (err, containerLogStream) => {
    if (err) {
      return logError(err.message);
    }
    const logs = [];
    containerLogStream.on('data', (chunk) => {
      onDataLogFn('LOG', logs, chunk);
    });
    const interval = setInterval(() => {
      if (logs.length === 0) {
        return;
      }
      const toPublish = { logs: [...logs] };
      logs.length = 0;
      console.log('publish', toPublish);
      this.device.publish(`${this.discoverBaseTopic}/${container.id}/logs`, JSON.stringify(toPublish));
    }, 5000);
    containerLogStream.on('end', () => {
      containerLogStream.removeAllListeners();
      clearInterval(interval);
    });
  });
};
