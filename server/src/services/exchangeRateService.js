const axios = require('axios');
const cache = require('./cacheService');
const prisma = require('../config/database');
const { EXCHANGE_RATE_API_KEY } = require('../config/environment');

const BASE_URL = 'https://v6.exchangerate-api.com/v6';
const ONE_HOUR_MS = 60 * 60 * 1000;

// pull rates through the three-layer cache: memory → db → external API
async function getRates(baseCurrency) {
  const key = `rates:${baseCurrency}`;

  // layer 1 — memory cache (fastest, gone on restart)
  const memCached = cache.get(key);
  if (memCached) {
    return { rates: memCached, fromCache: true, cachedAt: cache.getTimestamp(key) };
  }

  // layer 2 — database cache (survives restarts)
  const dbCached = await prisma.cachedRate.findUnique({
    where: { baseCurrency },
  });

  if (dbCached) {
    const age = Date.now() - new Date(dbCached.fetchedAt).getTime();
    if (age < ONE_HOUR_MS) {
      // warm up memory cache while we're here
      cache.set(key, dbCached.rates);
      return {
        rates: dbCached.rates,
        fromCache: true,
        cachedAt: dbCached.fetchedAt.toISOString(),
      };
    }
  }

  // layer 3 — hit the external API
  try {
    const { data } = await axios.get(
      `${BASE_URL}/${EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`
    );

    if (data.result !== 'success') {
      throw new Error(`ExchangeRate-API error: ${data['error-type']}`);
    }

    const rates = data.conversion_rates;
    const fetchedAt = new Date();

    // update both caches
    cache.set(key, rates);
    await prisma.cachedRate.upsert({
      where: { baseCurrency },
      update: { rates, fetchedAt },
      create: { baseCurrency, rates, fetchedAt },
    });

    return { rates, fromCache: false, cachedAt: fetchedAt.toISOString() };
  } catch (err) {
    // if the API is down, serve whatever stale data we have rather than crashing
    if (dbCached) {
      cache.set(key, dbCached.rates);
      return {
        rates: dbCached.rates,
        fromCache: true,
        stale: true,
        cachedAt: dbCached.fetchedAt.toISOString(),
      };
    }
    throw err;
  }
}

async function convert(from, to, amount) {
  const { rates, fromCache, stale, cachedAt } = await getRates(from);

  const rate = rates[to];
  if (!rate) {
    const err = new Error(`Unsupported currency code: ${to}`);
    err.status = 400;
    throw err;
  }

  const result = parseFloat((amount * rate).toFixed(6));
  return { from, to, amount, result, rate, fromCache, stale: stale || false, cachedAt };
}

// returns a flat list of currency codes from a USD base fetch
async function getCurrencies() {
  const { rates } = await getRates('USD');
  return Object.keys(rates).sort();
}

module.exports = { getRates, convert, getCurrencies };
