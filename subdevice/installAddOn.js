const { spawn } = require('child_process');

module.exports = function installAddOn(deviceId, deviceType, knownDevices, callback) {
  const { addOn, pairingMethods } = deviceType;

  console.log('installing add-on...');
  const ls = spawn('npm', ['i', addOn]);

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
    return callback(error);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    const GateAddOnSensorTag = require(addOn);
    let options = {};
    if (pairingMethods) {
      options = {
        touchlink: pairingMethods.indexOf('touchlink') !== -1,
      };
    }
    const gAddSensorTag = new GateAddOnSensorTag(deviceId, knownDevices, options);
    return callback(null, gAddSensorTag);
  });
};
