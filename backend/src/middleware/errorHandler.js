const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack || err.message);

  if (err.code === '23505') {
    return res.status(409).json({ success: false, message: 'Duplicate entry detected', error: err.detail });
  }
  if (err.code === '23503') {
    return res.status(400).json({ success: false, message: 'Referenced resource not found', error: err.detail });
  }
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ success: false, message: 'Database connection failed' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFound };
