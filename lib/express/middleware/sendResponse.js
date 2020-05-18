const _ = require('lodash');

module.exports = function sendResponse(req, res) {
  const statusCode = _.get(res, 'locals.statusCode') || 200;
  const response = _.get(res, 'locals.response') || {};
  return res.status(statusCode).json(response);
};
