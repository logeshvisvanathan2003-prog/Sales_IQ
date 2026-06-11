const express = require('express');
const router  = express.Router();
const {
  getTransactions, deleteTransaction,
  createTransaction, exportTransactionsCsv
} = require('../controllers/transactionsController');

router.get('/',         getTransactions);
router.get('/export',   exportTransactionsCsv);   // must be before /:id
router.post('/',        createTransaction);
router.delete('/:id',   deleteTransaction);

module.exports = router;