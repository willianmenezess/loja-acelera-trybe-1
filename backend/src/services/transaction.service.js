const model = require('../models/transaction.model');
const HttpException = require('../utils/httpException');

const create = async ({ accountId, value }) => {
  const transaction = await model.create({ accountId, value });

  return transaction;
};

const getAll = async ({ accountId, status = true }) => {
  const transactions = await model.getAll({ accountId, status });

  return transactions;
};

const createCashback = async ({ transactionId, cashback }) => {
  const transaction = await model.createCashback({ transactionId, cashback });
  // o httpException é um middleware que vai tratar o erro e poderia estar 
  // na camada controller
  if (!transaction) throw new HttpException(400, 'Nothing changed');
  return transaction;
};
module.exports = { create, getAll, createCashback };