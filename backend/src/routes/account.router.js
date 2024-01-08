const express = require('express');

const accountController = require('../controllers/account.controller');

const { 
  bodyAccountValidate, 
  identifierStructureValidate,
  identifierRuleValidate,
  bodyAccountValidateEditAccount,
  
} = require('../middlewares/accountValidade');
const authMiddleware = require('../middlewares/authMiddleware');

const accountRouter = express.Router();

accountRouter.post(
  '/', 
  bodyAccountValidate,
  identifierStructureValidate,
  identifierRuleValidate,
  accountController.create,
);

accountRouter.put(
  '/',
  bodyAccountValidateEditAccount,
  authMiddleware,
  accountController.update,
);

accountRouter.delete(
  '/',
  authMiddleware,
  accountController.destroy,
);

accountRouter.get(
  '/',
  authMiddleware,
  accountController.getOne,
);

module.exports = accountRouter;