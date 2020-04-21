const debug = require('debug');
const stream = require('stream');

const logError = debug('gate:error');

function onDataLogFn(type, logs) {
  return function onDataLog(chunk) {
    const logEntry = {
      message: `[${type}] ${chunk.toString()}`,
      timestamp: new Date().getTime(),
    };
    logs.push(logEntry);
  };
}

module.exports = function sendGateLogs(docker) {
  const gateContainer = docker.getContainer('gate');
  const stdOutStream = new stream.PassThrough();
  const stdErrStream = new stream.PassThrough();
  let logs = [];
  stdOutStream.on('data', onDataLogFn('LOG', logs));
  stdErrStream.on('data', onDataLogFn('ERR', logs));

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
      return logError(err.message);
    }
    gateContainer.modem.demuxStream(containerLogStream, stdOutStream, stdErrStream);
    containerLogStream.on('end', () => {
      containerLogStream.removeAllListeners();
      // clearInterval(interval);
      stdOutStream.end('!stop!');
    });
  });
};
