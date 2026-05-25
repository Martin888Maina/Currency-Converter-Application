const rateLimit = require('express-rate-limit');

// 100 requests per 15-minute window per IP; keeps usage within the free ExchangeRate-API monthly quota
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
