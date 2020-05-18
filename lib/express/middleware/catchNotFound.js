const createError = require('http-errors');

module.exports = function catchNotFound(req, res, next) {
  next(createError(404));
};
