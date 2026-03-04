const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// load env and validate before anything else
const { CLIENT_URL } = require('./config/environment');

app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limit all API routes
app.use('/api', rateLimiter);

app.use('/api', require('./routes/convertRoutes'));
// app.use('/api/favorites', require('./routes/favoritesRoutes'));  — Phase 3
// app.use('/api/history', require('./routes/historyRoutes'));       — Phase 3

// health check so we can confirm the server is up
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

module.exports = app;
