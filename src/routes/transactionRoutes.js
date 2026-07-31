const express = require('express');
const transactionController = require('../controllers/transactionController');
const {
  validateTransactionCreate,
  validateTransactionUpdate,
  validateIdParam,
} = require('../middleware/validator');

const router = express.Router();

// NOTE: /summary and /insights must be declared before the /:id route
// so Express doesn't treat "summary"/"insights" as an :id value.
router.get('/summary', transactionController.getSummary);
router.get('/insights', transactionController.getMonthlyInsights);

router.get('/', transactionController.getAllTransactions);
router.get('/:id', validateIdParam('id'), transactionController.getTransactionById);
router.post('/', validateTransactionCreate, transactionController.createTransaction);
router.put(
  '/:id',
  validateIdParam('id'),
  validateTransactionUpdate,
  transactionController.updateTransaction
);
router.delete('/:id', validateIdParam('id'), transactionController.deleteTransaction);

module.exports = router;
