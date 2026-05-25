const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// load env and validate before anything else
const { CLIENT_URL } = require('./config/environment');

// required when running behind a reverse proxy (Nginx); allows express-rate-limit
// to read the real client IP from the X-Forwarded-For header
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', rateLimiter);

app.use('/api', require('./routes/convertRoutes'));
app.use('/api/favorites', require('./routes/favoritesRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

module.exports = app;
