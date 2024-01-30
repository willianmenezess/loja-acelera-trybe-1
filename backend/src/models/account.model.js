const connection = require('./connection');

const create = async ({ identifier, name, email, password, status }) => {
  const [rows] = await connection.execute(`
    INSERT INTO accounts
      (identifier, name, email, password, status)
    VALUES (?, ?, ?, ?, ?);
  `, [identifier, name, email, password, status]);

  return { id: rows.insertId, identifier, name, email, status };
};

const login = async ({ identifier }) => {
  const [rows] = await connection.execute(`
  SELECT *
  FROM accounts WHERE identifier = ?;
`, [identifier]);

  return rows[0];
};

const updatePassword = async ({ accountId, password }) => {
  const [rows] = await connection.execute(`
    UPDATE  accounts SET
      password = ?
    WHERE id = ? and status = true;
  `, [password, accountId]);

  if (!rows.changedRows) return null;
  return true;
};

const update = async ({ accountId, name, email, status, password }) => {
  if (password) {
    await updatePassword({ accountId, password });
  }

  const [rows] = await connection.execute(`
    UPDATE  accounts SET
      name = ?, 
      email = ?, 
      status = ? 
    WHERE id = ? and status = true;
  `, [name, email, status, accountId]);

  if (!rows.changedRows) return null;
  return { id: accountId, name, email, status };
};

const destroy = async ({ accountId }) => {
  const [rows] = await connection.execute(`
    UPDATE  accounts SET 
      status = false 
    WHERE id = ? and status = true;
  `, [accountId]);

  if (!rows.changedRows) return null;
  return { accountId };
};

const getOne = async ({ accountId }) => {
  const [rows] = await connection.execute(`
    SELECT 
      id, identifier, name, email, isAdmin, status
    FROM accounts WHERE id = ? and status = 1;
  `, [accountId]);

  return rows[0];
};

const isExists = async (identifier) => {
  const [rows] = await connection.execute(`
    SELECT * FROM accounts WHERE identifier = ?;
  `, [identifier]);

  return { isExists: !!rows[0], status: rows[0] ? rows[0].status : undefined };
};

module.exports = { create, login, update, destroy, getOne, isExists };
