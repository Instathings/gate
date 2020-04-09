const stream = require('stream');

module.exports = function containerLogs(container) {
  const logStream = new stream.PassThrough();
  logStream.on('data', (chunk) => {
    const message = {
      log: chunk.toString('utf8'),
      timestamp: new Date().getTime(),
    }
    this.device.publish(`${this.discoverBaseTopic}/${container.id}/logs`, JSON.stringify(message));
  });

  const logsOp = {
    follow: true,
    stdout: true,
    stderr: true,
    since: new Date().getTime() / 1000,
  };

  return container.logs(logsOp, (err, stream) => {
    if (err) {
      return console.log(err.message);
    }
    container.modem.demuxStream(stream, logStream, logStream);
    stream.on('end', () => {
      stream.removeAllListeners();
      logStream.end('!stop!');
    });
  });
};