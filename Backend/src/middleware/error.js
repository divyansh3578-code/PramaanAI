function notFound(_req, _res, next) {
  const err = new Error('Route not found');
  err.status = 404;
  next(err);
}

function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {})
  });
}

module.exports = { notFound, errorHandler };
