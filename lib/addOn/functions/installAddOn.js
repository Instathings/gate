const debug = require('debug');
const { spawn } = require('child_process');

const log = debug('gate:log');
log.log = console.log.bind(console);
const logError = debug('gate:error');

module.exports = function installAddOn(addOn, callback) {
  log('Installing addon ...');
  const ls = spawn('npm', ['i', addOn]);
  ls.stdout.on('data', log);
  ls.stderr.on('data', logError);
  ls.on('error', logError);
  ls.on('close', () => {
    log(`${addOn} installed successfully`);
    return callback();
  });
};
