const bcrypt = require('bcrypt');
const models = require('../models/account.model');
const HttpException = require('../utils/httpException');
const { createToken } = require('../utils/jwt');

const create = async ({ identifier = '', name, email, password, status }) => {
  const findAccount = await models.isExists(identifier);

  if (findAccount.isExists && findAccount.status) { 
    throw new HttpException(400, 'User already created'); 
  }
  if (findAccount.isExists && !findAccount.status) {
    throw new HttpException(400, 'User already created, but it is not active'); 
  }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
  const account = await models.create({ identifier, name, email, password: hashPassword, status });
  return account;
};

const login = async ({ identifier, password }) => {
  const account = await models.login({ identifier });

  if (!account || !bcrypt.compareSync(password, account.password)) { 
    throw new HttpException(401, 'Identifier or password incorrect'); 
  }
  if (!account.status) { 
    throw new HttpException(401, 'User is not active'); 
  }
  return createToken({ id: account.id, status: account.status });
};

const loginAdmin = async ({ identifier, password }) => {
  const account = await models.login({ identifier });

  if (!account || account.password !== password || !account.isAdmin) { 
    throw new HttpException(401, 'Identifier or password incorrect'); 
  }
  return createToken({ id: account.id, status: account.status, isAdmin: true });
};

const update = async (parameters) => {
  const oldAccount = await models.getOne({ accountId: parameters.accountId });

  const removeNullValues = Object.fromEntries(
    Object.entries(parameters).filter(([_, value]) => value !== undefined),
  );

  const account = await models.update({ ...oldAccount, ...removeNullValues });
  if (!account) throw new HttpException(200, 'Nothing changed');
  return account;
};

const destroy = async ({ accountId }) => {
  const account = await models.destroy({ accountId });
  if (!account) throw new HttpException(412, 'Nothing was changed');
  return { accountId };
};

const getOne = async ({ accountId }) => {
  const account = await models.getOne({ accountId });
  if (!account) throw new HttpException(404, 'Account does not exist');
  return account;
};

module.exports = { create, login, update, destroy, loginAdmin, getOne };
