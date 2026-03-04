const prisma = require('../config/database');
const { Parser } = require('json2csv');
const { HISTORY_PAGE_SIZE } = require('../utils/constants');
const { getRateHistory } = require('../services/exchangeRateService');

// paginated list with optional filters
async function getHistory(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = parseInt(req.query.limit) || HISTORY_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const where = {};
    if (req.query.from) where.fromCurrency = req.query.from.toUpperCase();
    if (req.query.to) where.toCurrency = req.query.to.toUpperCase();

    // date range filter
    if (req.query.startDate || req.query.endDate) {
      where.createdAt = {};
      if (req.query.startDate) where.createdAt.gte = new Date(req.query.startDate);
      if (req.query.endDate) {
        const end = new Date(req.query.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [records, total] = await Promise.all([
      prisma.conversionHistory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.conversionHistory.count({ where }),
    ]);

    res.json({
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

// stream a CSV file of all matching records
async function exportHistory(req, res, next) {
  try {
    const where = {};
    if (req.query.from) where.fromCurrency = req.query.from.toUpperCase();
    if (req.query.to) where.toCurrency = req.query.to.toUpperCase();

    const records = await prisma.conversionHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (records.length === 0) {
      return res.status(404).json({ error: 'No records to export' });
    }

    const fields = [
      { label: 'Date', value: (r) => new Date(r.createdAt).toISOString() },
      { label: 'From', value: 'fromCurrency' },
      { label: 'To', value: 'toCurrency' },
      { label: 'Amount', value: (r) => Number(r.amount) },
      { label: 'Rate', value: (r) => Number(r.rate) },
      { label: 'Result', value: (r) => Number(r.result) },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="conversion-history.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

async function clearHistory(req, res, next) {
  try {
    await prisma.conversionHistory.deleteMany({});
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

// rate trend data for the Charts page
async function getRates(req, res, next) {
  try {
    const from = (req.query.from || 'USD').toUpperCase();
    const to = (req.query.to || 'KES').toUpperCase();
    const days = Math.min(90, Math.max(7, parseInt(req.query.days) || 30));

    const series = await getRateHistory(from, to, days);

    // summary stats — only calculate if we have data
    let summary = null;
    if (series.length > 0) {
      const rates = series.map((p) => p.rate);
      const min = Math.min(...rates);
      const max = Math.max(...rates);
      const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
      const first = rates[0];
      const last = rates[rates.length - 1];
      const change = ((last - first) / first) * 100;
      summary = { min, max, avg, change };
    }

    res.json({ from, to, days, series, summary });
  } catch (err) {
    next(err);
  }
}

module.exports = { getHistory, exportHistory, clearHistory, getRates };
