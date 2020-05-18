const debug = require('debug');
const logger = require('morgan');
const express = require('express');
const http = require('http');
const url = require('url');
const socketIo = require('socket.io');
const index = require('./endpoints/index');
const errorHandler = require('./middleware/errorHandler');
const catchNotFound = require('./middleware/catchNotFound');

const log = debug('gate:log');
log.log = console.log.bind(console); // don't forget to bind to console!

const logFormat = (process.env.NODE_ENV === 'development') ? 'dev' : 'combined';

module.exports = function expressServer() {
  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server);
  this.io = io;

  app.use(express.json());
  app.use('/device/v1', index(this.mongoClient));

  app.set('port', process.env.PORT);

  // log API call
  app.use(logger(logFormat, { stream: { write: (msg) => log(msg) } }));
  // catch 404 and forward to error handler
  app.use(catchNotFound);
  // error handler
  app.use(errorHandler);

  server.listen(process.env.PORT);
  log(`Gate listening on port: ${process.env.PORT}`);
};
