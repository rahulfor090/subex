// routes/admin/transactions.js
const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/transactionController');

// GET /api/admin/transactions
router.get('/', transactionController.getTransactions);

// GET /api/admin/transactions/:id
router.get('/:id', transactionController.getTransactionById);

module.exports = router;
