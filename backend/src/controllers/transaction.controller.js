const service = require('../services/transaction.service');

const create = async (req, res) => {
  const { value } = req.body;
  const { accountId } = req.account;

  const transaction = await service.create({ accountId, value });

  res.status(201).json(transaction);
};

// retorna todas as transações da conta que está logada
const getAll = async (req, res) => {
// accountId está no objeto req.account, pois o middleware de autenticação
// colocou ele lá
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