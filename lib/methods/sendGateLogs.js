const debug = require('debug')('gate');
const stream = require('stream');

module.exports = function sendGateLogs(docker) {
  const gateContainer = docker.getContainer('gate');
  const logStream = new stream.PassThrough();
  let logs = [];
  logStream.on('data', (chunk) => {
    const log = {
      message: chunk.toString(),
      timestamp: new Date().getTime(),
    };
    logs.push(log);
  });
  const interval = setInterval(() => {
    if (logs.length === 0) {
      return;
    }
    const toPublish = { logs: [...logs] };
    logs = [];
    this.device.publish(`${this.discoverBaseTopic}/${gateContainer.id}/logs`, JSON.stringify(toPublish));
  }, 5000);

  const logsOp = {
    follow: true,
    stdout: true,
    stderr: true,
    since: new Date().getTime() / 1000,
  };

  return gateContainer.logs(logsOp, (err, containerLogStream) => {
    if (err) {
      return debug(err.message);
    }
    gateContainer.modem.demuxStream(containerLogStream, logStream, logStream);
    containerLogStream.on('end', () => {
      containerLogStream.removeAllListeners();
      // clearInterval(interval);
      logStream.end('!stop!');
    });
  });
};
