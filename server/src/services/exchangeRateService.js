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

    // store a daily snapshot so Charts can build historical trend data
    // keyed as "USD:2026-03-04" — one row per base per day
    await saveDailySnapshot(baseCurrency, rates, fetchedAt);

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

// write one snapshot row per day per base currency — skip if today's is already there
async function saveDailySnapshot(baseCurrency, rates, fetchedAt) {
  const dateStr = fetchedAt.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const snapshotKey = `${baseCurrency}:${dateStr}`;

  try {
    await prisma.cachedRate.upsert({
      where: { baseCurrency: snapshotKey },
      update: {},   // don't overwrite — first fetch of the day wins
      create: { baseCurrency: snapshotKey, rates, fetchedAt },
    });
  } catch {
    // non-critical — if this fails the main response still works fine
  }
}

// build a time-series array for the Charts page
async function getRateHistory(from, to, days) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  // grab all daily snapshot rows for this base currency
  const snapshots = await prisma.cachedRate.findMany({
    where: {
      baseCurrency: { startsWith: `${from}:` },
      fetchedAt: { gte: since },
    },
    orderBy: { fetchedAt: 'asc' },
  });

  const series = snapshots
    .map((s) => {
      const rateVal = s.rates[to];
      if (!rateVal) return null;
      return {
        date: s.fetchedAt.toISOString().slice(0, 10),
        rate: Number(rateVal),
      };
    })
    .filter(Boolean);

  return series;
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

module.exports = { getRates, convert, getCurrencies, getRateHistory };
