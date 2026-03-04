// one hour — ExchangeRate-API only updates daily so this is plenty
const TTL_MS = 60 * 60 * 1000;

const store = new Map();

function get(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

function set(key, data) {
  store.set(key, { data, timestamp: Date.now() });
}

function isStale(key) {
  const entry = store.get(key);
  if (!entry) return true;
  return Date.now() - entry.timestamp > TTL_MS;
}

function getTimestamp(key) {
  const entry = store.get(key);
  return entry ? new Date(entry.timestamp).toISOString() : null;
}

module.exports = { get, set, isStale, getTimestamp };
