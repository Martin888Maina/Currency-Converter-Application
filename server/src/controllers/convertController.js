const exchangeRateService = require('../services/exchangeRateService');
const prisma = require('../config/database');

// list every supported currency code
async function getCurrencies(req, res, next) {
  try {
    const currencies = await exchangeRateService.getCurrencies();
    res.json({ currencies });
  } catch (err) {
    next(err);
  }
}

// all rates for a given base currency
async function getRates(req, res, next) {
  try {
    const base = (req.query.base || 'USD').toUpperCase();
    const { rates, fromCache, stale, cachedAt } = await exchangeRateService.getRates(base);
    res.json({ base, rates, fromCache, stale, cachedAt });
  } catch (err) {
    next(err);
  }
}

// convert and log to history
async function convertCurrency(req, res, next) {
  try {
    const from = (req.query.from || '').toUpperCase();
    const to = (req.query.to || '').toUpperCase();
    const amount = parseFloat(req.query.amount);

    if (!from || !to) {
      const err = new Error('from and to currency codes are required');
      err.status = 400;
      throw err;
    }

    if (isNaN(amount) || amount <= 0) {
      const err = new Error('amount must be a positive number');
      err.status = 400;
      throw err;
    }

    if (from === to) {
      return res.json({
        from,
        to,
        amount,
        result: amount,
        rate: 1,
        fromCache: true,
        stale: false,
        cachedAt: new Date().toISOString(),
      });
    }

    const conversion = await exchangeRateService.convert(from, to, amount);

    // log every conversion — fire and forget, don't let a db hiccup break the response
    prisma.conversionHistory
      .create({
        data: {
          fromCurrency: from,
          toCurrency: to,
          amount,
          result: conversion.result,
          rate: conversion.rate,
        },
      })
      .catch((err) => console.error('history log failed:', err.message));

    res.json(conversion);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCurrencies, getRates, convertCurrency };
