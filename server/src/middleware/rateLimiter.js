const rateLimit = require('express-rate-limit');

// 100 requests per 15 minutes per IP — generous enough for normal use
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a moment and try again.',
  },
});

module.exports = limiter;
