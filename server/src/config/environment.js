require('dotenv').config();

// fail fast if critical env vars are missing
const required = ['EXCHANGE_RATE_API_KEY', 'DATABASE_URL'];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  EXCHANGE_RATE_API_KEY: process.env.EXCHANGE_RATE_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
