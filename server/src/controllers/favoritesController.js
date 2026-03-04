const prisma = require('../config/database');

async function getFavorites(req, res, next) {
  try {
    const favorites = await prisma.favoritePair.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ favorites });
  } catch (err) {
    next(err);
  }
}

async function addFavorite(req, res, next) {
  try {
    const from = (req.body.from || '').toUpperCase().trim();
    const to = (req.body.to || '').toUpperCase().trim();

    if (!from || !to) {
      const err = new Error('from and to currency codes are required');
      err.status = 400;
      throw err;
    }

    if (from === to) {
      const err = new Error('Source and target currencies must be different');
      err.status = 400;
      throw err;
    }

    // upsert so clicking "add" twice doesn't explode
    const favorite = await prisma.favoritePair.upsert({
      where: { fromCurrency_toCurrency: { fromCurrency: from, toCurrency: to } },
      update: {},
      create: { fromCurrency: from, toCurrency: to },
    });

    res.status(201).json({ favorite });
  } catch (err) {
    // unique constraint — pair already exists
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'This pair is already in your favorites' });
    }
    next(err);
  }
}

async function deleteFavorite(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.favoritePair.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    next(err);
  }
}

module.exports = { getFavorites, addFavorite, deleteFavorite };
