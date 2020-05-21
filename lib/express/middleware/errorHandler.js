
module.exports = async function errorHandler(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  const obj = {
    message: err.message || 'Internal server error',
  };
  if (process.env.NODE_ENV !== 'production') {
    console.log(err.stack);
    obj.stack = err.stack;
  }
  return res.status(err.status || 500).json(obj);
};
