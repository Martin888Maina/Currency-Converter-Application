const { Router } = require('express');
const { getCurrencies, getRates, convertCurrency } = require('../controllers/convertController');

const router = Router();

router.get('/currencies', getCurrencies);
router.get('/rates', getRates);
router.get('/convert', convertCurrency);

module.exports = router;
