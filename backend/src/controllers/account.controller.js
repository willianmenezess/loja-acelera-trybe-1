const service = require('../services/account.service');

const create = async (req, res, next) => {
  try {
    const { identifier, name, email, password, status } = req.body;
    const account = await service.create({ identifier, name, email, password, status });
    return res.status(201).json(account);
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const token = await service.login({ identifier, password });
    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const loginAdmin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const token = await service.loginAdmin({ identifier, password });
    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { name, email, password, status } = req.body;
    const { accountId } = req.account;
    const account = await service.update({ accountId, name, email, password, status });
    res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { accountId } = req.account;
    await service.destroy({ accountId });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { accountId } = req.account;
    const account = await service.getOne({ accountId });
    res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};

module.exports = { create, login, update, destroy, loginAdmin, getOne };
