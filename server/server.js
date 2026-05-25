const app = require('./src/app');
const { PORT, HOST } = require('./src/config/environment');

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
