const HttpException = require('../utils/httpException');
const {
  accountSchemas,
  cnpj,
  cpf,
  editAccountSchemas,
} = require('../utils/schemas');
const { isCPFValid, isCnpjValid } = require('../utils/identifierRules');

const identifierStructureValidate = (req, res, next) => {
  const { identifier } = req.body;
  let err;
  if (identifier > 13) {
    const { error } = cnpj.validate(identifier);
    err = error;
  } else {
    const { error } = cpf.validate(identifier);
    err = error;
  }
  if (err) throw new HttpException(422, err.details[0].message);
  req.body.isCpf = true;
  next();
};
const identifierRuleValidate = (req, res, next) => {
  const { identifier, isCpf } = req.body;
  let err;
  if (!isCpf && !isCnpjValid(identifier)) {
    err = 'CNPJ invalid';
    throw new HttpException(422, err);
  }
  if (isCpf && !isCPFValid(identifier)) {
    err = 'CPF invalid';
    throw new HttpException(422, err);
  }

  next();
};
const bodyAccountValidate = (req, res, next) => {
  const { error } = accountSchemas.validate(req.body);
  if (error) throw new HttpException(422, error.details[0].message);
  next();
};

const bodyAccountValidateEditAccount = (req, res, next) => {
  const { error } = editAccountSchemas.validate(req.body);
  if (error) throw new HttpException(422, error.details[0].message);
  next();
};
module.exports = {
  bodyAccountValidateEditAccount,
  bodyAccountValidate,
  identifierStructureValidate,
  identifierRuleValidate,
};
