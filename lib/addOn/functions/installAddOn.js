const debug = require('debug')('gate');
const { spawn } = require('child_process');

module.exports = function installAddOn(addOn, callback) {
  debug('Installing addon ...');
  const ls = spawn('npm', ['i', addOn]);
  ls.stdout.on('data', debug);
  ls.stderr.on('data', debug);
  ls.on('error', debug);
  ls.on('close', () => {
    debug(`${addOn} installed successfully`);
    return callback();
  });
};
