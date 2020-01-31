const { spawn } = require('child_process');

module.exports = function installAddOn(addOn, knownDevices, callback) {
  console.log('installing add-on...')
  const ls = spawn('npm', ['i', addOn]);

  ls.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
    return callback(err);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    const GateAddOnSensorTag = require(addOn);
    const gAddSensorTag = new GateAddOnSensorTag(knownDevices);
    return callback(null, gAddSensorTag);
  });
};