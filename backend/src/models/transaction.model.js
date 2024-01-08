const connection = require('./connection');

const create = async ({ accountId, value }) => {
  const date = new Date();
  const [rows] = await connection.execute(`
    INSERT INTO transactions
      (accountId, value, date)
    VALUES (?, ?, ?);
  `, [accountId, value, date]);

  return { transactionId: rows.insertId, accountId, value, date };
};

const getAll = async ({ accountId, status = true }) => {
  const [rows] = await connection.execute(`
    SELECT 
      transactionId, accountId, cashback, value, date
    FROM transactions AS t 
      JOIN accounts AS a ON a.id = t.accountId 
    WHERE accountId = ? and status = ?;
  `, [accountId, status]);

  return rows;
};

const createCashback = async ({ transactionId, cashback }) => {
  const [rows] = await connection.execute(`
    UPDATE transactions
      SET cashback = ?
    WHERE transactionId = ?;
  `, [cashback, transactionId]);

  return !!rows.changedRows;
};

module.exports = { create, getAll, createCashback };