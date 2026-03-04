const { Router } = require('express');
const { getFavorites, addFavorite, deleteFavorite } = require('../controllers/favoritesController');

const router = Router();

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:id', deleteFavorite);

module.exports = router;
