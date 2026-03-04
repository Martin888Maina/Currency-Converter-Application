const prisma = require('../config/database');
const { Parser } = require('json2csv');
const { HISTORY_PAGE_SIZE } = require('../utils/constants');

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

module.exports = { getHistory, exportHistory, clearHistory };
