const express = require('express');

const accountController = require('../controllers/account.controller');
const {
  identifierStructureValidate,
  identifierRuleValidate,
} = require('../middlewares/accountValidade');

const { loginValidate } = require('../middlewares/loginValidade');

const loginRouter = express.Router();

loginRouter.post(
  '/', 
  loginValidate, 
  identifierStructureValidate,
  identifierRuleValidate, 
  accountController.login,
);
loginRouter.post(
  '/admin',
  loginValidate,
  identifierStructureValidate,
  identifierRuleValidate,
  accountController.loginAdmin,
);

module.exports = loginRouter;
