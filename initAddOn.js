const debug = require('debug');
const { spawn } = require('child_process');

module.exports = function initAddOn(addOn, deviceType) {
  switch (deviceType) {
    case 'pippo':

      break;

    default:
      const ls = spawn('npm', ['i', addOn]);

      ls.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      });

      ls.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
      });

      ls.on('error', (error) => {
        console.log(`error: ${error.message}`);
      });

      ls.on('close', code => {
        console.log(`child process exited with code ${code}`);
        const GateAddOnSensorTag = require(addOn);
        const gAddSensorTag = new GateAddOnSensorTag();
        gAddSensorTag.start();
      });
      break;
  }
};
