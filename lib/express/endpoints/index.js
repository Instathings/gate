const express = require('express');
const { param, query } = require('express-validator');

const sendResponse = require('../middleware/sendResponse');
const validation = require('../middleware/validation');

const getIngestionData = require('../routes/getIngestionData');

const router = express.Router();

module.exports = function indexFn(mongoClient) {
  router.get('/devices/:deviceId/data',
    param('deviceId').isAscii().isLength({ min: 7, max: 14 }),
    query('page')
      .optional().isInt().toInt(10)
      .withMessage('`page` must be an integer value'),
    query('perPage')
      .optional().isInt().toInt(10)
      .withMessage('`perPage` must be an integer value'),
    validation,
    getIngestionData(mongoClient),
    sendResponse);

  return router;
};
