const { Router } = require('express');
const { getHistory, exportHistory, clearHistory, getRates } = require('../controllers/historyController');

const router = Router();

// export before the generic list route so it doesn't get swallowed
router.get('/conversions/export', exportHistory);
router.get('/conversions', getHistory);
router.delete('/conversions', clearHistory);
router.get('/rates', getRates);

module.exports = router;
