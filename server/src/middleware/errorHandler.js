// ensures all error responses share a consistent shape regardless of where the error originates
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${status} — ${message}`, err.stack);
  }

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
