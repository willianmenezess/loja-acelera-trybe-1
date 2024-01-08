const HttpException = require('../utils/httpException');
const { transactionSchemas, cashbackSchemas } = require('../utils/schemas');

const transactionValidate = (req, res, next) => {
  const { error } = transactionSchemas.validate(req.body);
  if (error) throw new HttpException(422, error.details[0].message);

  next();
};

const cashbackValidate = (req, res, next) => {
  const { error } = cashbackSchemas.validate(req.body);
  if (error) throw new HttpException(422, error.details[0].message);

  next();
};
module.exports = { transactionValidate, cashbackValidate };