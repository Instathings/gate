const dotenv = require('dotenv');

const configFolder = process.env.CONFIG_FOLDER || 'config';
const configFile = `${__dirname}/${configFolder}/.env`;
dotenv.config({ path: configFile });

const Gate = require('./lib/Gate');

const gate = new Gate(configFolder);
gate.start();
