const HttpException = require('../utils/httpException');
const { loginSchemas } = require('../utils/schemas');

const loginValidate = (req, res, next) => {
  const { error } = loginSchemas.validate(req.body);
  if (error) throw new HttpException(422, error.details[0].message);

  next();
};
module.exports = { loginValidate };