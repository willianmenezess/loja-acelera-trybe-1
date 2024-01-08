const service = require('../services/transaction.service');

const create = async (req, res) => {
  const { value } = req.body;
  const { accountId } = req.account;

  const transaction = await service.create({ accountId, value });

  res.status(201).json(transaction);
};

const getAll = async (req, res) => {
  const { accountId, status = true } = req.account;
  const transactions = await service.getAll({ accountId, status });

  res.status(200).json(transactions);
};

const createCashback = async (req, res, next) => {
  try {
    const { transactionId, cashback } = req.body;
    
    await service.createCashback({ transactionId, cashback });
    
    res.status(200).json();
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, createCashback };