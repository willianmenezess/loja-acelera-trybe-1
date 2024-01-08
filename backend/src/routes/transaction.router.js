const express = require('express');

const transactionController = require('../controllers/transaction.controller');

const authMiddleware = require('../middlewares/authMiddleware');
const { transactionValidate, cashbackValidate } = require('../middlewares/transactionValidade');

const transactionRouter = express.Router();

transactionRouter.post('/', transactionValidate, authMiddleware, transactionController.create);

transactionRouter.get('/', authMiddleware, cashbackValidate, transactionController.getAll);

transactionRouter.put(
  '/cashback', 
  authMiddleware,
  transactionController.createCashback,
);

module.exports = transactionRouter;