const Joi = require('joi');

const cpfRegex = /(\d){3}\.(\d){3}\.(\d){3}-(\d){2}/;
const cnpjRegex = /(\d){2}\.(\d){3}\.(\d){3}\/(\d){3}[1|2]-(\d){2}/;

const cpf = Joi.string().required().regex(cpfRegex).messages({
  'string.pattern.base': 'CPF invalid',
});
const cnpj = Joi.string().required().regex(cnpjRegex);

const accountSchemas = Joi.object({
  identifier: Joi.string().trim().min(1),
  name: Joi.string().required().trim().min(3),
  email: Joi.string().required().trim().email(),
  password: Joi.string().required().trim().min(6),
  status: Joi.boolean(),
});

const editAccountSchemas = Joi.object({
  identifier: Joi.string().trim().min(1),
  name: Joi.string().trim().min(3),
  email: Joi.string().trim().email(),
  password: Joi.string().trim().min(6),
  status: Joi.boolean(),
});

const loginSchemas = Joi.object({
  identifier: Joi.string().trim().min(1),
  password: Joi.string().required().trim().min(6),
});

const transactionSchemas = Joi.object({
  value: Joi.number().greater(0).required(),
});
const cashbackSchemas = Joi.object({
  // cashback: Joi.number().less(1).greater(0).required(),
  accountId: Joi.number().required,
});
module.exports = {
  editAccountSchemas,
  accountSchemas,
  cpf,
  cnpj,
  loginSchemas,
  transactionSchemas,
  cashbackSchemas,
};
